import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
    OrbitControlsComponent,
    PerspectiveCameraComponent,
    RendererCanvasComponent,
    SceneComponent,
} from 'atft';
import { selectShowAxis, selectShowGrid } from 'src/app/modules/controls-renderer/selectors';
import { selectCameraFov } from 'src/app/modules/controls/selectors/controls.selectors';
import { ScreenSizeService } from 'src/app/modules/screen-size/services';
import * as THREE from 'three';
import * as graphActions from '../../actions';
import { GraphState } from '../../reducer';
import { CameraControllerService, OrbitControllerService } from '../../services';

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
        public screenSizeService: ScreenSizeService,
        public cameraControllerService: CameraControllerService,
        public orbitControllerService: OrbitControllerService,
    ) {}

    public showGrid$ = this.store$.select(selectShowGrid);
    public showAxis$ = this.store$.select(selectShowAxis);
    public selectCameraFov$ = this.store$.select(selectCameraFov);

    public ngAfterViewInit() {
        this.scene.getObject().fog = new THREE.FogExp2(0x000000, 0.1);
        this.cameraControllerService.setCamera(this.cameraComponent?.camera);
        this.orbitControllerService.setOrbitControlsComponent(this.orbitControlsComponent);

        this.actions$.pipe(ofType(graphActions.recomputeCanvasSize)).subscribe(() => {
            this.renderCanvas.onResize(undefined);
            this.cameraComponent.camera.updateProjectionMatrix();
        });
    }
}
