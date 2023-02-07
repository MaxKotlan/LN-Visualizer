import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-table-view',
    templateUrl: './table-view.component.html',
    styleUrls: ['./table-view.component.scss'],
})
export class TableViewComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    @Input() searchLabel;
    @Input() set dataRegistry(dataRegistry: Map<any, any>) {
        this._dataRegistry = dataRegistry;
    }
    @Input() searchTerms = ['public_key'];

    get searchTermsLabel() {
        return this.searchTerms.join(', ');
    }

    private _dataRegistry: Map<any, any>;

    dataSource: Array<any>;

    ngOnInit(): void {
        this.dataSource = Array.from(this._dataRegistry?.values()).slice(0, 10);
        this.paginator.page.pipe(untilDestroyed(this)).subscribe(() => {
            this.recalc();
        });
    }
    public count: number = 0;

    recalc() {
        const filtered = Array.from(this._dataRegistry?.values()).filter((x) =>
            this.searchTerms.some((y) =>
                x[y].toUpperCase().includes(this.searchTerm.toUpperCase()),
            ),
        );
        this.count = filtered.length;
        const maxPage = Math.ceil(this.count / 10);

        if (this.paginator.pageIndex > maxPage) this.paginator.pageIndex = 0;

        this.dataSource = filtered.slice(
            10 * this.paginator.pageIndex,
            10 * (this.paginator.pageIndex + 1),
        );
    }

    public searchTerm: string;
    public page: number = 0;

    @Input() displayedColumns: string[] = [
        'public_key',
        'alias',
        'color',
        'updated_at',
        'node_capacity',
        'node_channel_count',
    ];
}
