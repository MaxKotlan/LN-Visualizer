import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NodeTableComponent } from 'src/app/ui/table-view/components/node-table/node-table.component';

@Component({
    selector: 'app-table-search-button',
    templateUrl: './table-search-button.component.html',
    styleUrls: ['./table-search-button.component.scss'],
})
export class TableSearchButtonComponent {
    constructor(public dialog: MatDialog) {}

    @Input() public inline: boolean = false;

    openDialog(): void {
        this.dialog.open(NodeTableComponent, {
            maxWidth: null,
            panelClass: 'custom-pannel',
            height: '90vh',
        });
    }
}
