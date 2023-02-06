import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
    FilteredNodeRegistryService,
    NodeRegistryService,
} from 'src/app/graph-data/data-registries/services';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

@UntilDestroy()
@Component({
    selector: 'app-table-view',
    templateUrl: './table-view.component.html',
    styleUrls: ['./table-view.component.scss'],
})
export class TableViewComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<TableViewComponent>,
        private nodeRegistry: NodeRegistryService,
        public filteredNodeRegistry: FilteredNodeRegistryService,
    ) {}

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    ngOnInit(): void {
        this.paginator.page.pipe(untilDestroyed(this)).subscribe(() => {
            this.recalc();
        });
    }
    public count: number = this.filteredNodeRegistry.size;

    recalc() {
        const filtered = Array.from(this.filteredNodeRegistry.values()).filter((x) =>
            x.alias.toUpperCase().includes(this.searchTerm.toUpperCase()),
        );
        this.count = filtered.length;
        this.dataSource = filtered.slice(
            10 * this.paginator.pageIndex,
            10 * (this.paginator.pageIndex + 1),
        );
    }

    public searchTerm: string;
    public page: number = 0;

    displayedColumns: string[] = [
        'public_key',
        'alias',
        'color',
        'updated_at',
        'node_capacity',
        'node_channel_count',
    ];

    dataSource = Array.from(this.filteredNodeRegistry.values()).slice(0, 10);
}
