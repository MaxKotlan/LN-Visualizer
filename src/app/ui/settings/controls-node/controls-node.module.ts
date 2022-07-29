import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material';
import { FormsModule } from '@angular/forms';
import { NodeSettingsComponent } from './components';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { ClearnetOnionEffects } from './effects/clearnet-onion.effects';
import { FilterTemplatesModule } from 'src/app/filter-engine/filter-templates/filter-templates.module';

@NgModule({
    declarations: [NodeSettingsComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        FilterTemplatesModule,
        StoreModule.forFeature('nodeControls', reducer),
        EffectsModule.forFeature([ClearnetOnionEffects]),
    ],
    exports: [NodeSettingsComponent],
})
export class ControlsNodeModule {}
