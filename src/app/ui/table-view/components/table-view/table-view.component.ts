import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NodeRegistryService } from 'src/app/graph-data/data-registries/services';

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
    ) {}

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    ngOnInit(): void {
        this.paginator.page.pipe(untilDestroyed(this)).subscribe(() => {
            this.recalc();
        });
    }

    recalc() {
        this.dataSource = Array.from(this.nodeRegistry.values()).slice(
            10 * this.paginator.pageIndex,
            10 * (this.paginator.pageIndex + 1),
        );
    }

    public page: number = 0;

    displayedColumns: string[] = [
        'public_key',
        'alias',
        'color',
        'updated_at',
        'node_capacity',
        'node_channel_count',
    ];

    dataSource = Array.from(this.nodeRegistry.values()).slice(0, 10);
}
