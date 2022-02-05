import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { resetControlsToDefault } from 'src/app/actions/controls.actions';
import { ControlsState } from 'src/app/reducers/controls.reducer';

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
