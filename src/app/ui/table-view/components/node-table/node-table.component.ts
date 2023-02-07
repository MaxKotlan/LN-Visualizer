import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FilteredNodeRegistryService } from 'src/app/graph-data/data-registries/services';
import { TableViewComponent } from '../table-view/table-view.component';

@Component({
    selector: 'app-node-table',
    templateUrl: './node-table.component.html',
    styleUrls: ['./node-table.component.scss'],
})
export class NodeTableComponent {
    constructor(
        public dialogRef: MatDialogRef<TableViewComponent>,
        public filteredNodeRegistry: FilteredNodeRegistryService,
    ) {}
}
