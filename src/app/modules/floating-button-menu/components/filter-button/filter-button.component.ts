import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilterModalComponent } from '../../../controls-graph-filter/components/filter-modal/filter-modal.component';

@Component({
    selector: 'app-filter-button',
    templateUrl: './filter-button.component.html',
    styleUrls: ['./filter-button.component.scss'],
})
export class FilterButtonComponent {
    constructor(public dialog: MatDialog) {}

    openDialog(): void {
        this.dialog.open(FilterModalComponent, {
            maxWidth: null,
            panelClass: 'custom-pannel',
            height: '90vh',
            maxHeight: '768px',
        });
    }
}
