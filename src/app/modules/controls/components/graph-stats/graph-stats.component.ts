import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as graphSelectors from '../../../graph-renderer/selectors';

@Component({
    selector: 'app-graph-stats',
    templateUrl: './graph-stats.component.html',
    styleUrls: ['./graph-stats.component.scss'],
})
export class GraphStatsComponent {
    constructor(private store: Store) {}

    public nodeCount$: Observable<number> = this.store.select(graphSelectors.selectNodeCount);
    public channelCount$: Observable<number> = this.store.select(graphSelectors.selectChannelCount);
}
