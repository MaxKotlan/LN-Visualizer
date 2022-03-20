import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import * as graphSelectors from '../../../graph-renderer/selectors';

@Component({
    selector: 'app-graph-stats',
    templateUrl: './graph-stats.component.html',
    styleUrls: ['./graph-stats.component.scss'],
})
export class GraphStatsComponent {
    constructor(private store: Store) {}

    // public minimumCapacity$: Observable<number> = this.store
    //     .select(graphSelectors.selectMinimumChannelCapacity)
    //     .pipe(map((c) => (c === Infinity ? 0 : c)));
    // public maximumCapacity$: Observable<number> = this.store.select(
    //     graphSelectors.selectMaximumChannelCapacity,
    // );
    // public totalCapacity$: Observable<number> = this.store.select(
    //     graphSelectors.selectTotalChannelCapacity,
    // );
    // public averageCapacity$: Observable<number> = this.store.select(
    //     graphSelectors.selectAverageCapacity,
    // );

    public statLabels$: Observable<string[]> = this.store.select(graphSelectors.statsLabels);

    public nodeCount$: Observable<number> = this.store.select(graphSelectors.selectNodeCount);
    public channelCount$: Observable<number> = this.store.select(graphSelectors.selectChannelCount);
}
