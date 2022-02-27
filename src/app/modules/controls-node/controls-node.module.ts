import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material';
import { FormsModule } from '@angular/forms';
import { NodeSettingsComponent } from './components';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';

@NgModule({
    declarations: [NodeSettingsComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        StoreModule.forFeature('nodeControls', reducer),
    ],
    exports: [NodeSettingsComponent],
})
export class ControlsNodeModule {}
