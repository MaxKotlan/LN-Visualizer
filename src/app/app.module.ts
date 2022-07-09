import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouteEffects } from './effects/route.effects';
import { ControlsGraphFilterModule } from './modules/controls-graph-filter/controls-graph-filter.module';
import { ControlsEffects } from './modules/controls/effects/controls.effects';
import { PilotFlagsModule } from './modules/pilot-flags/pilot-flags.module';
import { WindowManagerModule } from './modules/window-manager/window-manager.module';

let dev = [];

if (!environment.production || window?.location?.toString()?.includes('devMode=true')) {
    dev = [
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
            autoPause: true, // Pauses recording actions and state changes when the extension window is not open
            name: 'LnVisualizer',
        }),
    ];
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ControlsGraphFilterModule,
        PilotFlagsModule,
        WindowManagerModule,
        EffectsModule.forRoot([ControlsEffects, RouteEffects]),
        StoreModule.forRoot(
            {},
            {
                runtimeChecks: {
                    strictStateImmutability: false,
                    strictActionImmutability: false,
                },
            },
        ),
        ...dev,
        BrowserAnimationsModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
