import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscSettingsComponent } from './components';
import { MaterialModule } from '../material';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducers';
import { ShowDonateLinkCheckboxComponent } from './components/show-donate-link-checkbox/show-donate-link-checkbox.component';
import { DisplayUnitSelectorComponent } from './components/display-unit-selector/display-unit-selector.component';

@NgModule({
    declarations: [MiscSettingsComponent, ShowDonateLinkCheckboxComponent, DisplayUnitSelectorComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        StoreModule.forFeature('miscControls', reducer),
    ],
    exports: [MiscSettingsComponent, ShowDonateLinkCheckboxComponent],
})
export class ControlsMiscModule {}
