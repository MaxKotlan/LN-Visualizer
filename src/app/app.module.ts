import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AtftModule } from 'atft';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CameraSettingsComponent } from './components/camera-settings/camera-settings.component';
import { ChannelSettingsComponent } from './components/channel-settings/channel-settings.component';
import { ErrorComponent } from './components/error/error.component';
import { GraphEdgeMeshComponent } from './components/graph-edge-mesh/graph-edge-mesh.component';
import { GraphFontMeshComponent } from './components/graph-font-mesh/graph-font-mesh.component';
import { GraphNodeMeshComponent } from './components/graph-node-mesh/graph-node-mesh.component';
import { GraphSceneComponent } from './components/graph-scene/graph-scene.component';
import { GraphStatsComponent } from './components/graph-stats/graph-stats.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { MiscSettingsComponent } from './components/misc-settings/misc-settings.component';
import { NodeSettingsComponent } from './components/node-settings/node-settings.component';
import { QuickControlsComponent } from './components/quick-controls/quick-controls.component';
import { SearchComponent } from './components/search/search.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { LndRaycasterCameraDirective } from './directives/lnd-raycaster-camera.directive';
import { LndRaycasterEnableDirective } from './directives/lnd-raycaster-enable.directive';
import { LndRaycasterSceneDirective } from './directives/lnd-raycaster-scene.directive';
import { ControlsEffects } from './effects/controls.effects';
import { GraphEffects } from './effects/graph.effects';
import { RouteEffects } from './effects/route.effects';
import { MaterialModule } from './modules/material';
import { metaReducers, reducers } from './reducers';
import { GraphMeshStateService } from './services/graph-mesh-state.service';
import { LndRaycasterService } from './services/lnd-raycaster-service';

@NgModule({
    declarations: [
        AppComponent,
        GraphSceneComponent,
        GraphEdgeMeshComponent,
        GraphNodeMeshComponent,
        GraphFontMeshComponent,
        SearchComponent,
        QuickControlsComponent,
        SettingsComponent,
        SettingsModalComponent,
        ErrorComponent,
        LndRaycasterEnableDirective,
        LndRaycasterCameraDirective,
        LndRaycasterSceneDirective,
        LoadingBarComponent,
        GraphStatsComponent,
        CameraSettingsComponent,
        ChannelSettingsComponent,
        NodeSettingsComponent,
        MiscSettingsComponent,
        TooltipComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        AtftModule,
        EffectsModule.forRoot([ControlsEffects, GraphEffects, RouteEffects]),
        MaterialModule,
        StoreModule.forRoot(reducers, {
            metaReducers,
            runtimeChecks: {
                strictStateImmutability: false,
                strictActionImmutability: false,
            },
        }),
        BrowserAnimationsModule,
    ],
    providers: [LndRaycasterService, GraphMeshStateService],
    bootstrap: [AppComponent],
})
export class AppModule {}
