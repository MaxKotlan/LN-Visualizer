import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { resetControlsToDefault } from '../../actions';
import { GenericControlsState } from '../../reducers';

@Component({
    selector: 'app-misc-settings',
    templateUrl: './misc-settings.component.html',
    styleUrls: ['./misc-settings.component.scss'],
})
export class MiscSettingsComponent {
    constructor(private store: Store<GenericControlsState>) {}

    resetSettingsToDefault() {
        this.store.dispatch(resetControlsToDefault());
    }
}
