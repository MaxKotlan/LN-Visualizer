import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectChannelCount, selectNodeCount } from 'src/app/modules/graph-renderer/selectors';
import * as graphSelectors from '../../../graph-statistics/selectors';

@Component({
    selector: 'app-global-graph-stats',
    templateUrl: './global-graph-stats.component.html',
    styleUrls: ['./global-graph-stats.component.scss'],
})
export class GlobalGraphStatsComponent {
    constructor(private store: Store) {}

    public averageCapacity$: Observable<number> = this.store.select(
        graphSelectors.selectAverageCapacity,
    );

    public statLabels$: Observable<string[]> = this.store.select(graphSelectors.statsLabels);

    public nodeCount$: Observable<number> = this.store.select(selectNodeCount);
    public channelCount$: Observable<number> = this.store.select(selectChannelCount);
}
