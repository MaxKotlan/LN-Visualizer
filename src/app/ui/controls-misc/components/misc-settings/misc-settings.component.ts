import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { deleteGraphDatabase } from 'src/app/renderer/graph-renderer/actions/graph-database.actions';
import { pilotIsUnitConversionsEnabled$ } from 'src/app/ui/pilot-flags/selectors/pilot-flags.selectors';
import { resetControlsToDefault } from '../../../controls/actions';
import { GenericControlsState } from '../../../controls/reducers';

@Component({
    selector: 'app-misc-settings',
    templateUrl: './misc-settings.component.html',
    styleUrls: ['./misc-settings.component.scss'],
})
export class MiscSettingsComponent {
    constructor(private store: Store<GenericControlsState>) {}

    public isPilotFlagEnabled$ = this.store.select(pilotIsUnitConversionsEnabled$);

    resetSettingsToDefault() {
        this.store.dispatch(resetControlsToDefault());
    }

    deleteDatabase() {
        this.store.dispatch(deleteGraphDatabase());
    }
}
