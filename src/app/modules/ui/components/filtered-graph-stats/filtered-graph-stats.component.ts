import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as graphSelectors from '../../../graph-statistics/selectors';

@Component({
    selector: 'app-filtered-graph-stats',
    templateUrl: './filtered-graph-stats.component.html',
    styleUrls: ['./filtered-graph-stats.component.scss'],
})
export class FilteredGraphStatsComponent {
    constructor(private store: Store) {}

    public filteredStatLabels$: Observable<string[]> = this.store.select(
        graphSelectors.filteredStatsLabels,
    );
}
