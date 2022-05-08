import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AnimationService } from 'atft';
import { filter, map, Observable, Subscription, throttleTime, withLatestFrom } from 'rxjs';
import { gotodistance, zoomTiming } from 'src/app/constants/gotodistance.constant';
import { meshScale } from 'src/app/constants/mesh-scale.constant';
import { gotoNode } from 'src/app/modules/controls-node/actions';
import {
    selectCameraFocusMode,
    selectCameraFov,
} from 'src/app/modules/controls/selectors/controls.selectors';
import * as THREE from 'three';
import { Camera, PerspectiveCamera, Vector3 } from 'three';
import { NodeSearchEffects } from '../../effects/node-search.effects';
import { GraphState } from '../../reducer';
import { OrbitControllerService } from '../orbit-controller';

@Injectable({
    providedIn: 'root',
})
export class CameraControllerService {
    constructor(
        private actions$: Actions,
        private store$: Store<GraphState>,
        private nodeSearchEffects: NodeSearchEffects,
        public orbitControllerService: OrbitControllerService,
        private animationService: AnimationService,
    ) {
        this.handleUpdates();
        this.animate = this.animate.bind(this);
        this.animation = this.animationService.animate.subscribe(this.animate);
        this.animationService.start();
    }

    public camera: PerspectiveCamera;
    public selectCameraFov$ = this.store$.select(selectCameraFov);

    setCamera(camera: Camera) {
        this.camera = camera as PerspectiveCamera;
    }

    handleUpdates() {
        this.selectCameraFov$.subscribe((fov) => {
            if (this.camera) {
                this.camera.fov = fov;
                this.camera.updateProjectionMatrix();
            }
        });
        this.nodeSearchEffects.selectFinalMatcheNodesFromSearch$
            .pipe(withLatestFrom(this.store$.select(selectCameraFocusMode)))
            .subscribe(([finalNode, focusmode]) => {
                const meshVec = finalNode?.position.clone().multiplyScalar(meshScale);
                if (focusmode === 'goto') this.gotoLocation(meshVec);
                if (focusmode === 'lookat') this.lookAtLocation(meshVec);
            });
        this.gotoCoordinates$.subscribe((newTarget) => this.gotoLocation(newTarget));
    }

    public lookAtLocation(newTarget: Vector3) {
        if (!this.camera || !this.orbitControllerService.controls) return;
        if (!newTarget) return;

        const camMat = this.camera.matrix.clone();
        const currentRot = this.camera.quaternion.clone();
        camMat.lookAt(this.camera.position, newTarget.clone(), new Vector3(0, 1, 0));
        const newQuat = new THREE.Quaternion().setFromRotationMatrix(camMat);
        const rotationKF = new THREE.QuaternionKeyframeTrack(
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
        const cameraMoveClip = new THREE.AnimationClip('NewLocationAnimation', 20, [rotationKF]);
        this.mixer = new THREE.AnimationMixer(this.camera);
        const clipAction = this.mixer.clipAction(cameraMoveClip);
        clipAction.setLoop(THREE.LoopOnce, 1);
        clipAction.play();

        (this.orbitControllerService.controls as any).controls.target.set(
            newTarget.x * meshScale,
            newTarget.y * meshScale,
            newTarget.z * meshScale,
        );
    }

    public gotoLocation(newTarget: Vector3) {
        if (!this.camera || !this.orbitControllerService.controls) return;

        const currentCords = this.camera.position.clone();
        const currentRot = this.camera.quaternion.clone();

        const camMat = this.camera.matrix.clone();
        camMat.lookAt(currentCords, newTarget.clone(), new Vector3(0, 1, 0));
        const newQuat = new THREE.Quaternion().setFromRotationMatrix(camMat);
        const newCoordinate = newTarget.clone().sub(currentCords);
        newCoordinate.multiplyScalar(1 - gotodistance / newCoordinate.length());
        newCoordinate.add(currentCords);

        const positionKF = new THREE.VectorKeyframeTrack(
            '.position',
            [0, zoomTiming],
            [
                this.camera.position.x,
                this.camera.position.y,
                this.camera.position.z,
                newCoordinate.x,
                newCoordinate.y,
                newCoordinate.z,
            ],
            THREE.InterpolateSmooth,
        );

        const rotationKF = new THREE.QuaternionKeyframeTrack(
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
        this.mixer = new THREE.AnimationMixer(this.camera);
        const clipAction = this.mixer.clipAction(cameraMoveClip);
        clipAction.setLoop(THREE.LoopOnce, 1);
        clipAction.play();

        (this.orbitControllerService.controls as any).controls.target.set(
            newTarget.x,
            newTarget.y,
            newTarget.z,
        );
    }

    public gotoCoordinates$: Observable<THREE.Vector3> = this.actions$.pipe(
        ofType(gotoNode),
        withLatestFrom(this.nodeSearchEffects.selectFinalMatcheNodesFromSearch$),
        map(([, node]) => node?.position),
        filter((pos) => !!pos),
        map((pos) => pos.clone().multiplyScalar(meshScale)),
    );

    public animate() {
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta());
        }
    }

    private mixer: THREE.AnimationMixer | undefined;
    private clock = new THREE.Clock();
    protected animation: Subscription | undefined;
}
