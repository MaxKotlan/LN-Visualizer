import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, combineLatest, filter, tap } from 'rxjs';
import * as filterActions from '../../controls-graph-filter/actions';
import { NodeFeatureFilter } from '../../filter-templates';
import { nodeFeaturesFilterEnabled$ } from '../../pilot-flags/selectors';
import {
    disabledFeatureBits,
    isNodeFeatureFilterEnabled,
} from '../selectors/node-features.selectors';
import * as filterSelectors from '../../controls-graph-filter/selectors/filter.selectors';
import * as nodeFeatureActions from '../actions/node-feature.actions';

@Injectable()
export class NodeFeaturesEffects {
    removeFilte$ = createEffect(
        () =>
            combineLatest([
                this.actions$.pipe(ofType(nodeFeatureActions.enableNodeFeaturesFilter)),
                this.store$.select(nodeFeaturesFilterEnabled$),
            ]).pipe(
                tap((x) => console.log(x)),
                filter(
                    ([switchEnabled, pilotFlagEnabled]) =>
                        !switchEnabled.isEnabled || !pilotFlagEnabled,
                ),
                map(() =>
                    filterActions.removeChannelFilterByIssueId({
                        issueId: this.nodeFeatureFilter.issueId,
                    }),
                ),
                tap((x) => console.log(x)),
            ),
        { dispatch: true },
    );

    nodeFeatureScript$ = createEffect(
        () =>
            combineLatest([
                this.store$.select(disabledFeatureBits),
                this.actions$.pipe(ofType(nodeFeatureActions.enableNodeFeaturesFilter)),
                this.store$.select(nodeFeaturesFilterEnabled$),
            ]).pipe(
                filter(
                    ([, switchEnabled, pilotFlagEnabled]) =>
                        switchEnabled.isEnabled && pilotFlagEnabled,
                ),
                map(([disabledFeatureBits]) => {
                    return filterActions.updateNodeFilterByIssueId({
                        value: this.nodeFeatureFilter.createFilter(disabledFeatureBits),
                    });
                }),
            ),
        { dispatch: true },
    );

    filterChanged$ = createEffect(() =>
        this.store$.select(filterSelectors.isFilterActive(this.nodeFeatureFilter.issueId)).pipe(
            filter((isEnabled) => !isEnabled),
            map(() => nodeFeatureActions.enableNodeFeaturesFilter({ isEnabled: false })),
        ),
    );

    constructor(
        private actions$: Actions,
        private store$: Store,
        private nodeFeatureFilter: NodeFeatureFilter,
    ) {}
}
