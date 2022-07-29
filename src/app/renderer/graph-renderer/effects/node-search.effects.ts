import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LndChannel } from 'api/src/models';
import {
    combineLatest,
    distinctUntilChanged,
    filter,
    from,
    map,
    mergeMap,
    share,
    shareReplay,
} from 'rxjs';
import { meshScale } from 'src/app/constants/mesh-scale.constant';
import { Uniform, Vector3 } from 'three';
import * as filterActions from 'src/app/filter-engine/controls-graph-filter/actions';
import { selectSearchString } from 'src/app/ui/settings/controls/selectors/controls.selectors';
import { ConnectedChannelsFilter } from 'src/app/filter-engine/filter-templates/channel-filters/connected-channels.filter';
import { setFilteredNodes } from '../../../graph-data/graph-process-data/actions';
import { FilteredNodeRegistryService } from 'src/app/graph-data/data-registries/services';
@Injectable()
export class NodeSearchEffects {
    constructor(
        private filteredNodeRegistry: FilteredNodeRegistryService,
        private store$: Store<any>,
        private actions$: Actions,
        private connectedChannelsFilter: ConnectedChannelsFilter,
    ) {}

    public generateSearchSubset$ = this.actions$.pipe(
        ofType(setFilteredNodes),
        map(() =>
            Array.from(this.filteredNodeRegistry.values()).sort(
                (a, b) => b.node_capacity - a.node_capacity,
            ),
        ),
        share(),
    );

    public selectPossibleNodesFromSearch$ = combineLatest([
        this.generateSearchSubset$,
        this.store$.select(selectSearchString),
    ]).pipe(
        filter(([subset]) => !!subset),
        map(([subset, searchString]) => {
            return subset.filter(
                (a) =>
                    a.public_key.toUpperCase().includes(searchString.toUpperCase()) ||
                    a.alias.toUpperCase().includes(searchString.toUpperCase()),
            );
        }),
        share(),
    );

    public selectFinalMatcheNodesFromSearch$ = this.selectPossibleNodesFromSearch$.pipe(
        map((nodes) => {
            if (!!(nodes.length === 1 && nodes[0]?.public_key)) return nodes[0];
        }),
        shareReplay(1),
        distinctUntilChanged((a, b) => a?.public_key === b?.public_key),
    );

    selectFinalMatchAliasFromSearch$ = this.selectFinalMatcheNodesFromSearch$.pipe(
        map((nodeMatch) => nodeMatch?.alias || ''),
        share(),
    );

    selectFinalPositionFromSearch$ = this.selectFinalMatcheNodesFromSearch$.pipe(
        map(
            (nodeMatch) =>
                new Uniform(
                    nodeMatch?.position.clone().multiplyScalar(meshScale) || new Vector3(0, 0, 0),
                ),
        ),
        shareReplay(),
    );

    selectNodesSearchResults$ = this.selectPossibleNodesFromSearch$.pipe(
        map((nodes) =>
            nodes.map((a) => ({ publicKey: a.public_key, alias: a.alias })).slice(0, 100),
        ),
        share(),
    );

    addNodeFilter$ = createEffect(
        () =>
            this.selectFinalMatcheNodesFromSearch$.pipe(
                mergeMap((c) => {
                    let addPubKeyFilter = [];
                    if (c)
                        addPubKeyFilter.push(
                            filterActions.addChannelFilter({
                                value: this.connectedChannelsFilter.createFilter(c.public_key),
                            }),
                        );

                    return from([
                        filterActions.removeChannelFilterByIssueId({ issueId: 'addNodeFilter' }),
                        ...addPubKeyFilter,
                    ]);
                }),
            ),
        { dispatch: true },
    );
}
