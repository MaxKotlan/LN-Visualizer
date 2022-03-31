import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { resetControlsToDefault } from '../../../controls/actions';
import { GenericControlsState } from '../../../controls/reducers';
import { setDonateLinkVisible } from '../../actions';
import { donateLinkVisible } from '../../selectors/misc-controls.selectors';

@Component({
    selector: 'app-misc-settings',
    templateUrl: './misc-settings.component.html',
    styleUrls: ['./misc-settings.component.scss'],
})
export class MiscSettingsComponent {
    constructor(private store: Store<GenericControlsState>) {}

    public donateLinkVisible$ = this.store.select(donateLinkVisible);

    resetSettingsToDefault() {
        this.store.dispatch(resetControlsToDefault());
    }

    setDonateLinkVisible(event: MatCheckboxChange) {
        this.store.dispatch(setDonateLinkVisible({ value: event.checked }));
    }
}
