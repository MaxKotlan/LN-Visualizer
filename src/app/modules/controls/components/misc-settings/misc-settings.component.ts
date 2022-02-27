import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ControlsState } from 'src/app/modules/controls/reducers/controls.reducer';
import { resetControlsToDefault } from '../../actions';

@Component({
    selector: 'app-misc-settings',
    templateUrl: './misc-settings.component.html',
    styleUrls: ['./misc-settings.component.scss'],
})
export class MiscSettingsComponent {
    constructor(private store: Store<ControlsState>) {}

    resetSettingsToDefault() {
        this.store.dispatch(resetControlsToDefault());
    }
}
