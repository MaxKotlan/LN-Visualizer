import {
    Component,
    EventEmitter,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    SkipSelf,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
    AbstractObject3D,
    provideParent,
    RaycasterEmitEvent,
    RaycasterEvent,
    RendererService,
    SphereMeshComponent,
} from 'atft';
import { take } from 'rxjs';
import { selectNodeMotionIntensity } from 'src/app/modules/controls-renderer/selectors';
import { searchGraph } from 'src/app/modules/controls/actions/controls.actions';
import { ToolTipService } from 'src/app/services/tooltip.service';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { GraphState } from '../../graph-renderer/reducer';
import { selectClosestPoint, selectFinalPositionFromSearch } from '../../graph-renderer/selectors';
import { LndRaycasterService } from '../../graph-renderer/services';
import { AnimationTimeService } from '../../graph-renderer/services/animation-timer/animation-time.service';
import { NodePoint } from '../three-js-objects/NodePoint';
import { NodeGeometry } from '../geometry/node-geometry.service';
import { NodeMaterial } from '../material/node-material.service';

@Component({
    selector: 'app-nodes-object',
    providers: [provideParent(SphereMeshComponent)],
    template: '<ng-content></ng-content>',
})
export class NodesObjectComponent
    extends AbstractObject3D<NodePoint>
    implements OnChanges, OnInit, OnDestroy
{
    @Output() mouseEnter = new EventEmitter<RaycasterEmitEvent>();
    @Output() mouseExit = new EventEmitter<RaycasterEmitEvent>();
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() click = new EventEmitter<RaycasterEmitEvent>();

    constructor(
        protected override rendererService: RendererService,
        @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
        private raycasterService: LndRaycasterService,
        private store$: Store<GraphState>,
        public toolTipService: ToolTipService,
        private nodeGeometry: NodeGeometry,
        private nodeMaterial: NodeMaterial,
        private animationTimeService: AnimationTimeService,
    ) {
        super(rendererService, parent);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.raycasterService.addGroup(this);
        this.subscribeEvents();
    }

    override ngOnDestroy(): void {
        this.unsubscribeEvents();
        super.ngOnDestroy();
    }

    private subscribeEvents() {
        this.object.addEventListener(RaycasterEvent.mouseEnter, this.onMouseEnter.bind(this));
        this.object.addEventListener(RaycasterEvent.mouseExit, this.onMouseExit.bind(this));
        this.object.addEventListener(RaycasterEvent.click, this.onClick.bind(this));
    }

    private unsubscribeEvents() {
        this.object.removeEventListener(RaycasterEvent.mouseEnter, this.onMouseEnter.bind(this));
        this.object.removeEventListener(RaycasterEvent.mouseExit, this.onMouseExit.bind(this));
        this.object.removeEventListener(RaycasterEvent.click, this.onClick.bind(this));
    }

    private onMouseExit() {
        this.nodeMaterial.handleHoverUpdate(new Vector3(0, 0, 0));
        this.toolTipService.close();
        document.body.style.cursor = null as unknown as string;
    }

    private onMouseEnter(event: any) {
        document.body.style.cursor = 'pointer';
        const intersection = event as THREE.Intersection;
        this.store$
            .select(selectClosestPoint(intersection.point))
            .pipe(take(1))
            .subscribe((node) => {
                if (!node) return;
                this.nodeMaterial.handleHoverUpdate(node.position);
                this.toolTipService.open(
                    event.mouseEvent.clientX,
                    event.mouseEvent.clientY,
                    node.alias,
                );
            });
    }

    private onClick(event: any) {
        const intersection = event as THREE.Intersection;
        this.store$
            .select(selectClosestPoint(intersection.point))
            .pipe(take(1))
            .subscribe((node) => {
                if (!node) return;
                this.toolTipService.close();
                console.log(node);
                this.store$.dispatch(searchGraph({ searchText: node.public_key }));
            });
    }

    protected newObject3DInstance(): NodePoint {
        const mesh = new NodePoint(this.nodeGeometry, this.nodeMaterial);
        this.object = mesh;
        this.handleUpdates();
        this.nodeMaterial.handleHoverUpdate(new Vector3(0, 0, 0));
        return mesh;
    }

    private handleUpdates() {
        this.animationTimeService.sinTime$.subscribe((elapsed) => this.object?.setSinTime(elapsed));

        this.animationTimeService.cosTime$.subscribe((elapsed) => this.object?.setCosTime(elapsed));

        this.store$.select(selectNodeMotionIntensity).subscribe((intensity) => {
            const updatedIntensity = intensity / 1000.0;
            this.object?.setMotionIntenstiy(updatedIntensity);
        });

        this.store$.select(selectFinalPositionFromSearch).subscribe((position) => {
            this.object?.setMotionOrigin(position.value);
        });
    }
}