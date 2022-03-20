import { Component, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-filter-modal',
    templateUrl: './filter-modal.component.html',
    styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent {
    constructor(@Optional() public dialogRef: MatDialogRef<FilterModalComponent>) {}
}
