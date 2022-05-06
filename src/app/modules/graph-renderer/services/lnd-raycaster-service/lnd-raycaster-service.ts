import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { AbstractCamera, AbstractObject3D, RaycasterEvent, RendererService } from 'atft';
import { combineLatest, fromEvent, map, sampleTime, Subject, takeUntil, tap } from 'rxjs';
import { setMouseRay } from 'src/app/modules/controls-renderer/actions';
import * as THREE from 'three';
import { Camera, Intersection, Ray, Vector3 } from 'three';
import { AnimationTimeService } from '../animation-timer/animation-time.service';

interface NearestIntersection {
    intersection: THREE.Intersection | undefined | null;
    object: THREE.Object3D | null;
    face: THREE.Face | null | undefined;
}

/*
Need to change the behavior to get coordinates in world space
*/
@UntilDestroy()
@Injectable()
export class LndRaycasterService implements OnDestroy {
    private raycaster = new THREE.Raycaster();
    private selected: THREE.Object3D | undefined | null;
    private enabled = false;
    private camera: AbstractCamera<any> | undefined;
    private groups: Array<AbstractObject3D<any>> = [];
    private paused = false;
    private canvas: ElementRef | undefined;
    private lastIntersection: Intersection;

    constructor(
        private animationTimeService: AnimationTimeService,
        private renderService: RendererService,
        private store$: Store<any>,
    ) {
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.raycaster.params.Points.threshold = 1.0;
    }

    ngOnDestroy() {
        this.disable();
        //this.unsubscribe();
    }

    private drag: boolean = false;

    private subscribe() {
        //this.canvas?.nativeElement.addEventListener('mousemove', this.onMouseMove);
        //this.canvas?.nativeElement.addEventListener('touchstart', this.onTouchStart);

        combineLatest([
            this.animationTimeService.sinTime$,
            fromEvent(this.canvas?.nativeElement, 'mousemove').pipe(
                tap(() => {
                    this.drag = true;
                }),
            ),
        ])
            .pipe(
                untilDestroyed(this),
                takeUntil(this.oldVersion.asObservable()),
                map(([a, b]) => b),
                sampleTime(100),
            )
            .subscribe((e) => {
                this.onMouseMove(e);
            });

        fromEvent(this.canvas?.nativeElement, 'mousedown')
            .pipe(untilDestroyed(this), takeUntil(this.oldVersion.asObservable()))
            .subscribe(() => (this.drag = false));

        fromEvent(this.canvas?.nativeElement, 'mouseup')
            .pipe(untilDestroyed(this), takeUntil(this.oldVersion.asObservable()))
            .subscribe(this.onClick.bind(this));

        //fromEvent(this.canvas?.nativeElement, 'dragenter').subscribe((e) => console.log('drag', e));

        // this.canvas?.nativeElement.addEventListener('mousedown', () => (this.drag = false));
        // this.canvas?.nativeElement.addEventListener('mousemove', () => (this.drag = true));
        // this.canvas?.nativeElement.addEventListener('mouseup', this.onClick.bind(this));
    }

    // private unsubscribe() {
    //     // console.log('unsubscribe raycaster');
    //     //this.canvas?.nativeElement.removeEventListener('mousemove', this.onMouseMove);
    //     // this.canvas?.nativeElement.removeEventListener('dblclick', this.onClick);
    //     // this.canvas?.nativeElement.removeEventListener('touchstart', this.onTouchStart);
    // }

    public enable() {
        this.enabled = true;
    }

    public disable() {
        this.enabled = false;
    }

    public pause() {
        this.paused = true;
    }

    public resume() {
        this.paused = false;
    }

    get isEnabled() {
        return this.enabled;
    }

    public oldVersion = new Subject();

    public setCanvasObject(canvas: ElementRef) {
        // console.log('Add camera to raycaster', camera);
        this.canvas = canvas;
        this.oldVersion.next(undefined);
        this.subscribe();
    }

    public setCamera(camera: AbstractCamera<any>) {
        // console.log('Add camera to raycaster', camera);
        this.camera = camera;
    }

    public addGroup(group: AbstractObject3D<any>) {
        // console.log('RaycasterService.addGroup', group.name, group);
        this.groups.push(group);
    }

    private onMouseMove(event: any) {
        if (!this.isReady()) {
            return;
        }
        event.preventDefault();
        const i = this.getFirstIntersectedGroup(event.layerX, event.layerY);

        if (
            this.selected &&
            (this.selected?.id !== i?.object?.id || this.lastIntersection.index !== i.index)
        ) {
            this.selected.dispatchEvent({ type: RaycasterEvent.mouseExit });
            this.selected = null;
        }
        if (!this.selected) {
            if (i && i.object) {
                this.selected = i.object;
                this.selected.dispatchEvent({
                    type: RaycasterEvent.mouseEnter,
                    ...i,
                    mouseEvent: event,
                });
                this.lastIntersection = i;
            }
        }

        //console.log(event);
        // if (!this.isReady(true)) {
        //     return;
        // }
        // //event.preventDefault();
        // const i = this.getFirstIntersectedGroup(event.layerX, event.layerY);
        // if (i && i.object) {
        //     i.object.dispatchEvent({ type: RaycasterEvent.mouseEnter, ...i });
        // } else {
        //   dispatchEvent({ type: RaycasterEvent.mouseEnter, ...i })
        // }
    }

    private onClick(event: any) {
        if (!this.isReady(true)) {
            return;
        }
        //event.preventDefault();
        if (this.drag) return;
        const i = this.getFirstIntersectedGroup(event.layerX, event.layerY);
        if (i && i.object) {
            i.object.dispatchEvent({ type: RaycasterEvent.click, ...i, mouseEvent: event });
        }
    }

    private onTouchStart(event: TouchEvent) {
        // console.log(event);
        if (!this.isReady()) {
            return;
        }
        //event.preventDefault();
        if (this.drag) return;
        const i = this.getFirstIntersectedGroup(event.touches[0].clientX, event.touches[0].clientY);
        if (i && i.object) {
            i.object.dispatchEvent({ type: RaycasterEvent.click, ...i, mouseEvent: event });
        }
    }

    private isReady(ignorePaused?: boolean) {
        return (
            this.enabled &&
            (ignorePaused || !this.paused) &&
            this.camera &&
            this.camera.camera &&
            this.groups &&
            this.groups.length > 0
        );
    }

    private getFirstIntersectedGroup(x: any, y: any): THREE.Intersection | null {
        x = (x / this.canvas.nativeElement.clientWidth) * 2 - 1;
        y = -(y / this.canvas.nativeElement.clientHeight) * 2 + 1;
        const mouseVector = new THREE.Vector3(x, y, 0.5);
        this.raycaster.setFromCamera(mouseVector, this.camera?.camera);
        //console.log(this.camera.camera.position);

        // this.store$.dispatch(
        //     setMouseRay({
        //         value: this.raycaster.ray.clone(),
        //         //  new Ray(
        //         //     (this.camera.camera as Camera).position,
        //         //     (this.camera.camera as Camera).rotation.toVector3().normalize(),
        //         // ),
        //     }),
        // );

        let nearestIntersection: THREE.Intersection | undefined | null;
        for (let k = 0; k < this.groups.length; k++) {
            const i = this.groups[k].getObject();
            const intersection = this.raycaster.intersectObject(i, true);
            //console.log('Hit', intersection);
            if (
                intersection.length > 0 &&
                (!nearestIntersection || nearestIntersection.distance > intersection[0].distance)
            ) {
                nearestIntersection = intersection[0];
            }
        }
        if (nearestIntersection) return nearestIntersection;
        return null;
    }
}
