import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { PilotFlagEffects } from './effects/pilot-flags.effects';
import * as devModeReducer from './reducer/dev-mode.reducer';
import { PilotFlagModalComponent } from './components/pilot-flag-modal/pilot-flag-modal.component';
import { MaterialModule } from '../material';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [PilotFlagModalComponent],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        EffectsModule.forFeature([PilotFlagEffects]),
        StoreModule.forFeature('pilotFlags', reducer),
        StoreModule.forFeature('devMode', devModeReducer.reducer),
    ],
    exports: [PilotFlagModalComponent],
})
export class PilotFlagsModule {}
