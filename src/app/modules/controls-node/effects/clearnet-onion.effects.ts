import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import * as filterActions from '../../controls-graph-filter/actions';
import * as filterSelectors from '../../controls-graph-filter/selectors/filter.selectors';
import { NodeNetworkFilter } from '../../filter-templates/node-filters/network-filter';
import * as nodeActions from '../actions';
import { NodeControlState } from '../reducer';
import { selectNetworkFilter } from '../selectors/node-controls.selectors';

@Injectable()
export class ClearnetOnionEffects {
    saveControlsState$ = createEffect(() =>
        this.store$.select(selectNetworkFilter).pipe(
            map((networkType) => {
                if (networkType === 'Clearnet and Tor') {
                    return filterActions.removeChannelFilterByIssueId({
                        issueId: this.nodeNetworkFilter.issueId,
                    });
                } else {
                    return filterActions.updateNodeFilterByIssueId({
                        value: this.nodeNetworkFilter.createFilter(networkType),
                    });
                }
            }),
        ),
    );

    filterChanged$ = createEffect(() =>
        this.store$.select(filterSelectors.isFilterActive(this.nodeNetworkFilter.issueId)).pipe(
            filter((isEnabled) => !isEnabled),
            map(() => nodeActions.setNetworkFilter({ value: 'Clearnet and Tor' })),
        ),
    );

    constructor(
        private store$: Store<NodeControlState>,
        private nodeNetworkFilter: NodeNetworkFilter,
    ) {}
}
