import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, tap } from 'rxjs';
import * as filterActions from 'src/app/filter-engine/controls-graph-filter/actions';
import * as filterSelectors from 'src/app/filter-engine/controls-graph-filter/selectors/filter.selectors';
import { NodeFeatureFilter } from 'src/app/filter-engine/filter-templates';
import { nodeFeaturesFilterEnabled$ } from '../../pilot-flags/selectors';
import * as nodeFeatureActions from '../actions/node-feature.actions';
import { enabledFeatureBits } from '../selectors/node-features.selectors';

@Injectable()
export class NodeFeaturesEffects {
    removeFilte$ = createEffect(
        () =>
            combineLatest([
                this.actions$.pipe(ofType(nodeFeatureActions.enableNodeFeaturesFilter)),
                this.store$.select(nodeFeaturesFilterEnabled$),
            ]).pipe(
                filter(
                    ([switchEnabled, pilotFlagEnabled]) =>
                        !switchEnabled.isEnabled || !pilotFlagEnabled,
                ),
                map(() =>
                    filterActions.removeChannelFilterByIssueId({
                        issueId: this.nodeFeatureFilter.issueId,
                    }),
                ),
            ),
        { dispatch: true },
    );

    nodeFeatureScript$ = createEffect(
        () =>
            combineLatest([
                this.store$.select(enabledFeatureBits),
                this.actions$.pipe(ofType(nodeFeatureActions.enableNodeFeaturesFilter)),
                this.store$.select(nodeFeaturesFilterEnabled$),
            ]).pipe(
                filter(
                    ([, switchEnabled, pilotFlagEnabled]) =>
                        switchEnabled.isEnabled && pilotFlagEnabled,
                ),
                map(([enabledFeatureBits]) => {
                    return filterActions.updateNodeFilterByIssueId({
                        value: this.nodeFeatureFilter.createFilter(enabledFeatureBits),
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
