import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { FilterModalComponent } from 'src/app/modules/controls-graph-filter/components/filter-modal/filter-modal.component';
import { setModalOpen } from 'src/app/modules/window-manager/actions';
import { filterScriptsId } from 'src/app/modules/window-manager/constants/windowIds';
import { WindowManagerState } from 'src/app/modules/window-manager/reducers';

@Component({
    selector: 'app-filter-button',
    templateUrl: './filter-button.component.html',
    styleUrls: ['./filter-button.component.scss'],
})
export class FilterButtonComponent {
    constructor(public dialog: MatDialog, private store$: Store<WindowManagerState>) {}

    openDialog(): void {
        this.dialog.open(FilterModalComponent, {
            maxWidth: null,
            panelClass: 'custom-pannel',
            height: '90vh',
            maxHeight: '90vh',
        });

        // this.store$.dispatch(setModalOpen({ modalId: filterScriptsId }));
    }
}
