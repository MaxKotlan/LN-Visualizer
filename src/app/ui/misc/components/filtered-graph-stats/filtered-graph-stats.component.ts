import { NestedTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { KeyValueNode } from 'src/app/ui/node-info/components';
import * as graphSelectors from 'src/app/graph-data/graph-statistics/selectors';

@Injectable({
    providedIn: 'root',
})
export class FilteredStatTreeDataServiceService {
    public treeData$;

    constructor(public store: Store) {
        this.treeData$ = this.store.select(graphSelectors.filteredStatisticsSelector).pipe(
            // map(([s]) => s),
            filter((o) => o !== undefined && o !== null),
            map((object) => this.mapObject(object)),
        );
    }

    private mapObject(object: Object) {
        const o = Object.entries(object);
        return o
            .filter(([, v]) => v !== null && v !== undefined && v.length !== 0 && v.size !== 0)
            .map((kv) => this.mapKeys(kv))
            .sort((a, b) => {
                if (!Number.isNaN(a) && !Number.isNaN(b)) return a - b;
                return (a.key as string)
                    .toLocaleLowerCase()
                    .localeCompare(b.key.toLocaleLowerCase());
            });
    }

    private mapKeys([key, value]) {
        if (value instanceof Object) {
            if (value instanceof Map) {
                const r = this.mapObject(Object.fromEntries(value.entries()));
                return { key, children: r };
            }
            const children = this.mapObject(value);
            return { key, children: children };
        }
        return { key, value } as KeyValueNode;
    }
}

@UntilDestroy()
@Component({
    selector: 'app-filtered-graph-stats',
    templateUrl: './filtered-graph-stats.component.html',
    styleUrls: ['./filtered-graph-stats.component.scss'],
})
export class FilteredGraphStatsComponent implements AfterViewInit {
    treeControl = new NestedTreeControl<KeyValueNode>((node) => node.children);
    dataSource = new MatTreeNestedDataSource<KeyValueNode>();

    constructor(
        public treeDataServiceService: FilteredStatTreeDataServiceService,
        public cdr: ChangeDetectorRef,
    ) {}

    ngAfterViewInit(): void {
        this.treeDataServiceService.treeData$.pipe(untilDestroyed(this)).subscribe((data) => {
            this.dataSource.data = data;
            this.cdr.detectChanges();
        });
    }

    // public statLabels$: Observable<string[]> = this.store.select(graphSelectors.statsLabels);

    hasChild = (_: number, node: KeyValueNode) => !!node.children && node.children.length > 0;
}
