import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
    OrbitControlsComponent,
    OrthographicCameraComponent,
    PerspectiveCameraComponent,
    RendererCanvasComponent,
    RendererService,
    SceneComponent,
} from 'atft';
import {
    orthagraphicViewEnabled$,
    pilotThickLinesEnabled$,
    sphereNodesEnabled$,
} from 'src/app/ui/pilot-flags/selectors/pilot-flags.selectors';
import { ScreenSizeService } from 'src/app/ui/screen-size/services';
import { selectLineBackend } from 'src/app/ui/settings/controls-channel/selectors';
import {
    selectRenderResolution,
    selectShowAxis,
    selectShowGrid,
} from 'src/app/ui/settings/controls-renderer/selectors';
import { selectCameraFov } from 'src/app/ui/settings/controls/selectors/controls.selectors';
import * as graphActions from '../../../../graph-data/graph-process-data/actions';
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
    @ViewChild(OrthographicCameraComponent) orthoCameraComponent:
        | OrthographicCameraComponent
        | undefined;
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

    public thickLinesEnabled$ = this.store$.select(pilotThickLinesEnabled$);
    public lineBackend$ = this.store$.select(selectLineBackend);
    public sphereNodes$ = this.store$.select(sphereNodesEnabled$);
    public orthographicView$ = this.store$.select(orthagraphicViewEnabled$);

    public ngAfterViewInit() {
        // this.scene.getObject().fog = new THREE.FogExp2(0x000000, 0.1);
        if (this.orthoCameraComponent) {
            this.orthoCameraComponent.camera.far = 20000;
            this.orthoCameraComponent.camera.position.set(20, 50, 650);
            this.orthoCameraComponent.camera?.updateProjectionMatrix();
            console.log(this.orthoCameraComponent.camera);
        } else {
            this.cameraControllerService.setCamera(this.cameraComponent?.camera);
            this.orbitControllerService.setOrbitControlsComponent(this.orbitControlsComponent);

            this.actions$
                .pipe(ofType(graphActions.recomputeCanvasSize))
                .pipe(untilDestroyed(this))
                .subscribe(() => {
                    this.renderCanvas.onResize(undefined);
                    this.cameraComponent?.camera?.updateProjectionMatrix();
                });

            this.store$
                .select(selectRenderResolution)
                .pipe(untilDestroyed(this))
                .subscribe((renderResolution) => {
                    this.renderResolution = renderResolution;
                    this.renderer
                        .getWebGlRenderer()
                        .setPixelRatio(devicePixelRatio * this.renderResolution);
                });
        }
    }

    public renderResolution: number;

    @HostListener('window:resize', ['$event'])
    public onResize() {
        this.renderer.getWebGlRenderer().setPixelRatio(devicePixelRatio * this.renderResolution);
    }
}
