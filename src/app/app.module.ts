import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControlsEffects } from './modules/controls/effects/controls.effects';
import { RouteEffects } from './effects/route.effects';
import { GraphRendererModule } from './modules/graph-renderer';
import { ControlsModule } from './modules/controls/controls.module';
import { UiModule } from './modules/ui/ui.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        GraphRendererModule,
        ControlsModule,
        UiModule,
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
        BrowserAnimationsModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
