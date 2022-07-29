import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PilotFlagModalComponent } from 'src/app/ui/pilot-flags/components';

@Component({
    selector: 'app-table-search-button',
    templateUrl: './table-search-button.component.html',
    styleUrls: ['./table-search-button.component.scss'],
})
export class TableSearchButtonComponent {
    constructor(public dialog: MatDialog) {}

    @Input() public inline: boolean = false;

    openDialog(): void {
        this.dialog.open(PilotFlagModalComponent, {
            maxWidth: null,
            panelClass: 'custom-pannel',
            height: '90vh',
        });
    }
}
