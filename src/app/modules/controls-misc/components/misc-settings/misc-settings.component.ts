import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { deleteGraphDatabase } from 'src/app/modules/graph-renderer/actions/graph-database.actions';
import { resetControlsToDefault } from '../../../controls/actions';
import { GenericControlsState } from '../../../controls/reducers';
import { donateLinkVisible } from '../../selectors/misc-controls.selectors';

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

    deleteDatabase() {
        this.store.dispatch(deleteGraphDatabase());
    }
}
