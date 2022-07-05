import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';
import { NodeNetworkFilter } from '../../filter-templates/node-filters/network-filter';
import { NodeControlState } from '../reducer';
import { selectNetworkFilter } from '../selectors/node-controls.selectors';
import * as filterActions from '../../controls-graph-filter/actions';

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

    constructor(
        private store$: Store<NodeControlState>,
        private nodeNetworkFilter: NodeNetworkFilter,
    ) {}
}
