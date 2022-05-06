import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
    OrbitControlsComponent,
    PerspectiveCameraComponent,
    RendererCanvasComponent,
    RendererService,
    SceneComponent,
} from 'atft';
import {
    selectRenderResolution,
    selectShowAxis,
    selectShowGrid,
} from 'src/app/modules/controls-renderer/selectors';
import { selectCameraFov } from 'src/app/modules/controls/selectors/controls.selectors';
import { ScreenSizeService } from 'src/app/modules/screen-size/services';
import * as THREE from 'three';
import * as graphActions from '../../actions';
import { GraphState } from '../../reducer';
import { CameraControllerService, OrbitControllerService } from '../../services';

@UntilDestroy()
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
        private renderer: RendererService,
    ) {}

    public showGrid$ = this.store$.select(selectShowGrid);
    public showAxis$ = this.store$.select(selectShowAxis);
    public selectCameraFov$ = this.store$.select(selectCameraFov);

    public ngAfterViewInit() {
        this.scene.getObject().fog = new THREE.FogExp2(0x000000, 0.1);
        this.cameraControllerService.setCamera(this.cameraComponent?.camera);
        this.orbitControllerService.setOrbitControlsComponent(this.orbitControlsComponent);

        this.actions$
            .pipe(ofType(graphActions.recomputeCanvasSize))
            .pipe(untilDestroyed(this))
            .subscribe(() => {
                this.renderCanvas.onResize(undefined);
                this.cameraComponent.camera.updateProjectionMatrix();
            });

        this.store$.select(selectRenderResolution).subscribe((renderResolution) => {
            this.renderResolution = renderResolution;
            this.renderer
                .getWebGlRenderer()
                .setPixelRatio(devicePixelRatio * this.renderResolution);
        });
    }

    public renderResolution: number;

    @HostListener('window:resize', ['$event'])
    public onResize() {
        this.renderer.getWebGlRenderer().setPixelRatio(devicePixelRatio * this.renderResolution);
    }
}
