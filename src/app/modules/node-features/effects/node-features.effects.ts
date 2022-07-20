import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, combineLatest, filter } from 'rxjs';
import * as filterActions from '../../controls-graph-filter/actions';
import { NodeFeatureFilter } from '../../filter-templates';
import { nodeFeaturesFilterEnabled$ } from '../../pilot-flags/selectors';
import { disabledFeatureBits } from '../selectors/node-features.selectors';

@Injectable()
export class NodeFeaturesEffects {
    nodeFeatureScript$ = createEffect(
        () =>
            combineLatest([
                this.store$.select(disabledFeatureBits),
                this.store$.select(nodeFeaturesFilterEnabled$),
            ]).pipe(
                filter(([, pilotFlagEnabled]) => pilotFlagEnabled),
                map(([disabledFeatureBits]) => {
                    return filterActions.updateNodeFilterByIssueId({
                        value: this.nodeFeatureFilter.createFilter(disabledFeatureBits),
                    });
                }),
            ),
        { dispatch: true },
    );

    constructor(private store$: Store, private nodeFeatureFilter: NodeFeatureFilter) {}
}
