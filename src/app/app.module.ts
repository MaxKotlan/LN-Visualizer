import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouteEffects } from './effects/route.effects';
import { ControlsGraphFilterModule } from './modules/controls-graph-filter/controls-graph-filter.module';
import { ControlsModule } from './modules/controls/controls.module';
import { ControlsEffects } from './modules/controls/effects/controls.effects';
import { GraphRendererModule } from './modules/graph-renderer';
import { MaterialModule } from './modules/material';
import { UiModule } from './modules/ui/ui.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        GraphRendererModule,
        ControlsModule,
        ControlsGraphFilterModule,
        UiModule,
        EffectsModule.forRoot([ControlsEffects, RouteEffects]),
        MaterialModule,
        StoreModule.forRoot(
            {},
            {
                runtimeChecks: {
                    strictStateImmutability: false,
                    strictActionImmutability: false,
                },
            },
        ),
        BrowserAnimationsModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
