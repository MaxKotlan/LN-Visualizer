import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { PilotFlagEffects } from './effects/pilot-flags.effects';
import * as devModeReducer from './reducer/dev-mode.reducer';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        EffectsModule.forFeature([PilotFlagEffects]),
        StoreModule.forFeature('pilotFlags', reducer),
        StoreModule.forFeature('devMode', devModeReducer.reducer),
    ],
})
export class PilotFlagsModule {}
