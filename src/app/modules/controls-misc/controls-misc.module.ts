import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscSettingsComponent } from './components';
import { MaterialModule } from '../material';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducers';

@NgModule({
    declarations: [MiscSettingsComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        StoreModule.forFeature('miscControls', reducer),
    ],
    exports: [MiscSettingsComponent],
})
export class ControlsMiscModule {}
