import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
    AnimationService,
    OrbitControlsComponent,
    PerspectiveCameraComponent,
    RendererCanvasComponent,
    SceneComponent,
} from 'atft';
import { filter, map, Observable, Subscription, withLatestFrom } from 'rxjs';
import { gotodistance, zoomTiming } from 'src/app/constants/gotodistance.constant';
import { meshScale } from 'src/app/constants/mesh-scale.constant';
import { gotoNode } from 'src/app/modules/controls-node/actions';
import {
    selectPointUseIcon,
    shouldRenderNodes,
} from 'src/app/modules/controls-node/selectors/node-controls.selectors';
import { selectShowAxis, selectShowGrid } from 'src/app/modules/controls-renderer/selectors';
import {
    selectCameraFov,
    shouldRenderLabels,
} from 'src/app/modules/controls/selectors/controls.selectors';
import { ToolTipService } from 'src/app/services/tooltip.service';
import * as THREE from 'three';
import { Vector3 } from 'three';
import * as graphActions from '../../actions';
import { GraphState } from '../../reducer';
import { selectFinalMatcheNodesFromSearch } from '../../selectors';
import { GraphMeshStateService } from '../../services';

@Component({
    selector: 'app-graph-scene',
    templateUrl: './graph-scene.component.html',
    styleUrls: ['graph-scene.component.scss'],
})
export class GraphSceneComponent implements AfterViewInit {
    @ViewChild(RendererCanvasComponent) renderCanvas!: RendererCanvasComponent;
    @ViewChild(SceneComponent) scene!: SceneComponent;
    @ViewChild(PerspectiveCameraComponent) cameraComponent: PerspectiveCameraComponent | undefined;
    @ViewChild(OrbitControlsComponent) orbitControlsComponent: OrbitControlsComponent | undefined;

    constructor(
        private store$: Store<GraphState>,
        private actions$: Actions,
        private animationService: AnimationService,
        private graphMeshStateService: GraphMeshStateService,
        public toolTipService: ToolTipService,
    ) {}

    public positions$ = this.graphMeshStateService.nodeVertices$;
    public colors$ = this.graphMeshStateService.nodeColors$;
    public selectChannelData$ = this.graphMeshStateService.channelData$;
    public selectNodeCapacity$ = this.graphMeshStateService.nodeCapacity$;
    public selectPointUseIcon$ = this.store$.select(selectPointUseIcon);
    public shouldRenderLabels$ = this.store$.select(shouldRenderLabels);
    public shouldRenderNodes$ = this.store$.select(shouldRenderNodes);
    public selectCameraFov$ = this.store$.select(selectCameraFov);
    public showGrid$ = this.store$.select(selectShowGrid);
    public showAxis$ = this.store$.select(selectShowAxis);

    public gotoCoordinates$: Observable<THREE.Vector3> = this.actions$.pipe(
        ofType(gotoNode),
        withLatestFrom(this.store$.select(selectFinalMatcheNodesFromSearch)),
        map(([, node]) => node?.position),
        filter((pos) => !!pos),
        map((pos) => new THREE.Vector3(pos?.x, pos?.y, pos?.z).multiplyScalar(meshScale)),
    );

    public ngAfterViewInit() {
        this.animate = this.animate.bind(this);
        this.animation = this.animationService.animate.subscribe(this.animate);
        this.animationService.start();

        this.actions$.pipe(ofType(graphActions.recomputeCanvasSize)).subscribe(() => {
            this.renderCanvas.onResize(undefined);
            this.cameraComponent.camera.updateProjectionMatrix();
        });

        this.selectCameraFov$.subscribe((fov) => {
            const camera: any = this.cameraComponent?.camera;
            (camera as any).fov = fov;
            this.cameraComponent?.camera.updateProjectionMatrix();
        });

        this.store$.select(selectFinalMatcheNodesFromSearch).subscribe((newTarget) => {
            if (!this.cameraComponent || !this.orbitControlsComponent) return;
            if (!newTarget?.position) return;

            const camMat = this.cameraComponent.camera.matrix.clone();
            const currentRot = this.cameraComponent.camera.quaternion.clone();
            camMat.lookAt(
                this.cameraComponent.camera.position,
                newTarget.position.clone().multiplyScalar(meshScale),
                new Vector3(0, 1, 0),
            );
            const newQuat = new THREE.Quaternion().setFromRotationMatrix(camMat);
            const rotationKF = new THREE.VectorKeyframeTrack(
                '.quaternion',
                [0, zoomTiming],
                [
                    currentRot.x,
                    currentRot.y,
                    currentRot.z,
                    currentRot.w,
                    newQuat.x,
                    newQuat.y,
                    newQuat.z,
                    newQuat.w,
                ],
                THREE.InterpolateSmooth,
            );
            const cameraMoveClip = new THREE.AnimationClip('NewLocationAnimation', 20, [
                rotationKF,
            ]);
            this.mixer = new THREE.AnimationMixer(this.cameraComponent.camera);
            const clipAction = this.mixer.clipAction(cameraMoveClip);
            clipAction.setLoop(THREE.LoopOnce, 1);
            clipAction.play();

            (this.orbitControlsComponent as any).controls.target.set(
                newTarget.position.x * meshScale,
                newTarget.position.y * meshScale,
                newTarget.position.z * meshScale,
            );
        });

        this.gotoCoordinates$.subscribe((newTarget) => {
            if (!this.cameraComponent || !this.orbitControlsComponent) return;

            const currentCords = this.cameraComponent.camera.position.clone();
            const currentRot = this.cameraComponent.camera.quaternion.clone();

            const camMat = this.cameraComponent.camera.matrix.clone();
            camMat.lookAt(currentCords, newTarget.clone(), new Vector3(0, 1, 0));
            const newQuat = new THREE.Quaternion().setFromRotationMatrix(camMat);
            const newCoordinate = newTarget.clone().sub(currentCords);
            newCoordinate.multiplyScalar(1 - gotodistance / newCoordinate.length());
            newCoordinate.add(currentCords);

            const positionKF = new THREE.VectorKeyframeTrack(
                '.position',
                [0, zoomTiming],
                [
                    this.cameraComponent.camera.position.x,
                    this.cameraComponent.camera.position.y,
                    this.cameraComponent.camera.position.z,
                    newCoordinate.x,
                    newCoordinate.y,
                    newCoordinate.z,
                ],
                THREE.InterpolateSmooth,
            );

            const rotationKF = new THREE.VectorKeyframeTrack(
                '.quaternion',
                [0, zoomTiming],
                [
                    currentRot.x,
                    currentRot.y,
                    currentRot.z,
                    currentRot.w,
                    newQuat.x,
                    newQuat.y,
                    newQuat.z,
                    newQuat.w,
                ],
                THREE.InterpolateSmooth,
            );
            const cameraMoveClip = new THREE.AnimationClip('NewLocationAnimation', 20, [
                positionKF,
                rotationKF,
            ]);
            this.mixer = new THREE.AnimationMixer(this.cameraComponent.camera);
            const clipAction = this.mixer.clipAction(cameraMoveClip);
            clipAction.setLoop(THREE.LoopOnce, 1);
            clipAction.play();

            (this.orbitControlsComponent as any).controls.target.set(
                newTarget.x,
                newTarget.y,
                newTarget.z,
            );
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
