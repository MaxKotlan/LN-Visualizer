import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as graphSelectors from '../../../graph-statistics/selectors';

@Component({
    selector: 'app-global-graph-stats',
    templateUrl: './global-graph-stats.component.html',
    styleUrls: ['./global-graph-stats.component.scss'],
})
export class GlobalGraphStatsComponent {
    constructor(private store: Store) {}

    public statLabels$: Observable<string[]> = this.store.select(graphSelectors.statsLabels);
}
