import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
    FilteredChannelRegistryService,
    FilteredNodeRegistryService,
} from 'src/app/graph-data/data-registries/services';
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
        public filteredChannelRegistry: FilteredChannelRegistryService,
    ) {
        console.log(filteredChannelRegistry);
    }

    public nodeColumns = [
        'public_key',
        'alias',
        'color',
        'updated_at',
        'node_capacity',
        'node_channel_count',
    ];

    public channelColumns = ['id', 'capacity', 'transaction_id', 'transaction_vout', 'updated_at'];
}
