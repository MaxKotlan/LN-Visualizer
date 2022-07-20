import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';
import * as filterActions from '../../controls-graph-filter/actions';
import { NodeFeatureFilter } from '../../filter-templates';
import { disabledFeatureBits } from '../selectors/node-features.selectors';

@Injectable()
export class NodeFeaturesEffects {
    nodeFeatureScript$ = createEffect(
        () =>
            this.store$.select(disabledFeatureBits).pipe(
                map((disabledFeatureBits) => {
                    return filterActions.updateNodeFilterByIssueId({
                        value: this.nodeFeatureFilter.createFilter(disabledFeatureBits),
                    });
                }),
            ),
        { dispatch: true },
    );

    constructor(private store$: Store, private nodeFeatureFilter: NodeFeatureFilter) {}
}
