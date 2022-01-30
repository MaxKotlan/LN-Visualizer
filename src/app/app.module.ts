import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AtftModule } from 'atft';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphSceneComponent } from './components/graph-scene/graph-scene.component';
import { GraphEdgeMeshComponent } from './components/graph-edge-mesh/graph-edge-mesh.component';
import { GraphNodeMeshComponent } from './components/graph-node-mesh/graph-node-mesh.component';
import { NodePositionRegistryService } from './services/node-position-registry.service';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { GraphEffects } from './effects/graph.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { SearchComponent } from './components/search/search.component';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { GraphFontMeshComponent } from './components/graph-font-mesh/graph-font-mesh.component';
import { QuickControlsComponent } from './components/quick-controls/quick-controls.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MatIconModule } from '@angular/material/icon';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { ControlsEffects } from './effects/controls.effects';
import { ErrorComponent } from './components/error/error.component';
import { LndRaycasterService } from './services/lnd-raycaster-service';
import { LndRaycasterEnableDirective } from './directives/lnd-raycaster-enable.directive';
import { LndRaycasterCameraDirective } from './directives/lnd-raycaster-camera.directive';
import { LndRaycasterSceneDirective } from './directives/lnd-raycaster-scene.directive';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GraphMeshStateService } from './services/graph-mesh-state.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GraphStatsComponent } from './components/graph-stats/graph-stats.component';
import { RouteEffects } from './effects/route.effects';

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
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        AtftModule,
        EffectsModule.forRoot([ControlsEffects, GraphEffects, RouteEffects]),
        StoreModule.forRoot(reducers, {
            metaReducers,
            runtimeChecks: {
                strictStateImmutability: false,
                strictActionImmutability: false,
            },
        }),
        BrowserAnimationsModule,
        MatInputModule,
        MatCardModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatToolbarModule,
        MatDividerModule,
        MatProgressBarModule,
        MatSnackBarModule,
        // StoreDevtoolsModule.instrument({
        //     maxAge: 25,
        //     logOnly: true,
        //     autoPause: true,
        //     features: {
        //         pause: false,
        //         lock: true,
        //         persist: false,
        //         dispatch: false,
        //         reorder: false,
        //     },
        // }),
    ],
    providers: [NodePositionRegistryService, LndRaycasterService, GraphMeshStateService],
    bootstrap: [AppComponent],
})
export class AppModule {}
