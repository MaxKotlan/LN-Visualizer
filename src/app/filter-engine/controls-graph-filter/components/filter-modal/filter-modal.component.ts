import { Component, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setModalClose, toggleModalPreference } from 'src/app/ui/window-manager/actions';
import { filterScriptsId } from 'src/app/ui/window-manager/constants/windowIds';
import { WindowManagerState } from 'src/app/ui/window-manager/reducers';
import { selectModalPreference } from 'src/app/ui/window-manager/selectors';
import * as filterSelectors from '../../selectors/filter.selectors';

@Component({
    selector: 'app-filter-modal',
    templateUrl: './filter-modal.component.html',
    styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent {
    constructor(
        @Optional() public dialogRef: MatDialogRef<FilterModalComponent>,
        private store$: Store<WindowManagerState>,
    ) {}

    public activeNodeFilters$ = this.store$.select(filterSelectors.activeNodeFilters);
    public activeChannelFilters$ = this.store$.select(filterSelectors.activeChannelFilters);

    public windowPosition$: Observable<'modal' | 'sidebar'> = this.store$.select(
        selectModalPreference(filterScriptsId),
    );

    public togglePreference() {
        this.store$.dispatch(toggleModalPreference({ modalId: filterScriptsId }));
    }

    public closeModal() {
        this.dialogRef.close();
        //this.store$.dispatch(setModalClose({ modalId: filterScriptsId }));
    }
}
