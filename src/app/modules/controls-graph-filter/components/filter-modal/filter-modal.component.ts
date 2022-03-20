import { Component, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setModalClose, toggleModalPreference } from 'src/app/modules/window-manager/actions';
import { filterScriptsId } from 'src/app/modules/window-manager/constants/windowIds';
import { WindowManagerState } from 'src/app/modules/window-manager/reducers';
import { selectModalPreference } from 'src/app/modules/window-manager/selectors';

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
