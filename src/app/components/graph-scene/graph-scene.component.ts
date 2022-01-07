import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AnimationService, PerspectiveCameraComponent, SceneComponent } from 'atft';
import { filter, map, Observable, Subscription, withLatestFrom } from 'rxjs';
import { gotoNode } from 'src/app/actions/controls.actions';
import { GraphState } from 'src/app/reducers/graph.reducer';
import {
    selectCameraFov,
    selectEdgeDepthTest,
    selectEdgeDottedLine,
    selectNodeSize,
    selectPointAttenuation,
    selectPointUseIcon,
    shouldRenderEdges,
    shouldRenderLabels,
    shouldRenderNodes,
} from 'src/app/selectors/controls.selectors';
import {
    selectAliases,
    selectColors,
    selectEdgeColor,
    selectEdgeVertices,
    selectFinalMatcheNodesFromSearch,
    selectModifiedGraph,
    selectSortedEdges,
    selectVertices,
} from 'src/app/selectors/graph.selectors';
import { GraphMeshStateService } from 'src/app/services/graph-mesh-state.service';
import * as THREE from 'three';

@Component({
    selector: 'app-graph-scene',
    templateUrl: './graph-scene.component.html',
    styleUrls: ['graph-scene.component.scss'],
})
export class GraphSceneComponent implements AfterViewInit {
    @ViewChild(SceneComponent) scene!: SceneComponent;
    @ViewChild(PerspectiveCameraComponent) cameraComponent: PerspectiveCameraComponent | undefined;

    constructor(
        private store$: Store<GraphState>,
        private actions$: Actions,
        private animationService: AnimationService,
        private graphMeshStateService: GraphMeshStateService,
    ) {}

    public modifiedGraph$ = this.store$.select(selectModifiedGraph);
    public positions$ = this.graphMeshStateService.nodeVertices$; //this.store$.select(selectVertices);
    public colors$ = this.graphMeshStateService.nodeColors$; //this.store$.select(selectColors);
    public getSortedEdges$ = this.store$.select(selectSortedEdges);
    public shouldRenderEdges$ = this.store$.select(shouldRenderEdges);
    public selectEdgeColor$ = this.graphMeshStateService.channelColors$; //this.store$.select(selectEdgeColor);
    public selectAliases$ = this.store$.select(selectAliases);
    public selectEdgeVertices$ = this.graphMeshStateService.channelVertices$; //this.store$.select(selectEdgeVertices);
    public selectNodeSize$ = this.store$.select(selectNodeSize);
    public selectPointAttenuation$ = this.store$.select(selectPointAttenuation);
    public selectPointUseIcon$ = this.store$.select(selectPointUseIcon);
    public shouldRenderLabels$ = this.store$.select(shouldRenderLabels);
    public shouldRenderNodes$ = this.store$.select(shouldRenderNodes);
    public selectCameraFov$ = this.store$.select(selectCameraFov);
    public selectEdgeDepthTest$ = this.store$.select(selectEdgeDepthTest);
    public selectEdgeDottedLine$ = this.store$.select(selectEdgeDottedLine);

    public gotoCoordinates$: Observable<THREE.Vector3> = this.actions$.pipe(
        ofType(gotoNode),
        withLatestFrom(this.store$.select(selectFinalMatcheNodesFromSearch)),
        map(([, node]) => node?.postition),
        filter((pos) => !!pos),
        map((pos) => new THREE.Vector3(pos?.x, pos?.y, pos?.z).multiplyScalar(100)),
    );

    public onSelected() {
        console.log('ServerActorComponent.onSelected');
    }

    public onDeselected() {
        console.log('ServerActorComponent.onDeselected');
    }

    public onClick() {
        console.log('ServerActorComponent.onClick');
    }

    public ngAfterViewInit() {
        this.animate = this.animate.bind(this);
        this.animation = this.animationService.animate.subscribe(this.animate);
        this.animationService.start();

        this.selectCameraFov$.subscribe((fov) => {
            const camera: any = this.cameraComponent?.camera; //.fov = fov;
            (camera as any).fov = fov;
            this.cameraComponent?.camera.updateProjectionMatrix();
        });

        this.gotoCoordinates$.subscribe((newCoordinates) => {
            if (!this.cameraComponent) return;
            const currentCords = this.cameraComponent.camera.position;

            const temp = newCoordinates.clone();

            console.log('cur', currentCords);
            console.log('want', newCoordinates);

            const test = temp.clone().normalize().dot(currentCords.normalize());
            console.log(test);

            temp.sub(currentCords);
            temp.addScalar(3 * Math.cos(Math.PI * test));
            temp.add(currentCords);

            const positionKF = new THREE.VectorKeyframeTrack(
                '.position',
                [0, 0.2],
                [currentCords.x, currentCords.y, currentCords.z, temp.x, temp.y, temp.z],
            );
            const rotationKF = new THREE.VectorKeyframeTrack(
                '.rotation',
                [0, 0.2],
                [
                    currentCords.x,
                    currentCords.y,
                    currentCords.z,
                    newCoordinates.x,
                    newCoordinates.y,
                    newCoordinates.z,
                ],
            );
            const cameraMoveClip = new THREE.AnimationClip('NewLocationAnimation', 20, [
                positionKF,
            ]);
            this.mixer = new THREE.AnimationMixer(this.cameraComponent.camera);
            const clipAction = this.mixer.clipAction(cameraMoveClip);
            clipAction.setLoop(THREE.LoopOnce, 1);
            clipAction.play();
        });
    }

    public animate() {
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta());
        }
    }

    private mixer: THREE.AnimationMixer | undefined;
    private clock = new THREE.Clock();
    protected animation: Subscription | undefined;
}
