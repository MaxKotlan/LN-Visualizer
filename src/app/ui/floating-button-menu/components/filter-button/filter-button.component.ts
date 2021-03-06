import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { FilterModalComponent } from 'src/app/filter-engine/controls-graph-filter/components/filter-modal/filter-modal.component';
import { WindowManagerState } from 'src/app/ui/window-manager/reducers';

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
