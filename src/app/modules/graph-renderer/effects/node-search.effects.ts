import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LndChannel } from 'api/src/models';
import { combineLatest, distinctUntilChanged, filter, from, map, mergeMap, share, tap } from 'rxjs';
import { meshScale } from 'src/app/constants/mesh-scale.constant';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import { Uniform, Vector3 } from 'three';
import * as filterActions from '../../controls-graph-filter/actions';
import { selectSearchString } from '../../controls/selectors/controls.selectors';
import { setFilteredNodes } from '../actions';
import { FilteredNodeRegistryService } from '../services/filtered-node-registry/filtered-node-registry.service';

@Injectable()
export class NodeSearchEffects {
    constructor(
        private filteredNodeRegistry: FilteredNodeRegistryService,
        private store$: Store<any>,
        private actions$: Actions,
    ) {}

    public generateSearchSubset$ = this.actions$.pipe(
        ofType(setFilteredNodes),
        map(() => Array.from(this.filteredNodeRegistry.values())),
        share(),
    );

    public selectPossibleNodesFromSearch$ = combineLatest([
        this.generateSearchSubset$,
        this.store$.select(selectSearchString),
    ]).pipe(
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
        share(),
        distinctUntilChanged((a, b) => a?.public_key === b?.public_key),
    );

    selectFinalMatchAliasFromSearch$ = this.selectFinalMatcheNodesFromSearch$.pipe(
        map((nodeMatch) => nodeMatch?.alias || ''),
    );

    selectFinalPositionFromSearch$ = this.selectFinalMatcheNodesFromSearch$.pipe(
        map(
            (nodeMatch) =>
                new Uniform(
                    nodeMatch?.position.clone().multiplyScalar(meshScale) || new Vector3(0, 0, 0),
                ),
        ),
    );

    selectNodesSearchResults$ = this.selectPossibleNodesFromSearch$.pipe(
        map((nodes) =>
            nodes.map((a) => ({ publicKey: a.public_key, alias: a.alias })).slice(0, 100),
        ),
    );

    public selectClosestPoint(point: THREE.Vector3) {
        if (!this.filteredNodeRegistry) return;
        point.divideScalar(meshScale);
        let minDistance: null | number = null;
        let minDistanceIndex: null | string = null;
        this.filteredNodeRegistry.forEach((node: LndNodeWithPosition, pubkey) => {
            const pointDisance = node.position.distanceTo(point);
            if (minDistance === null || pointDisance < minDistance) {
                minDistance = pointDisance;
                minDistanceIndex = pubkey;
            }
        });
        if (minDistanceIndex === null) return;
        return this.filteredNodeRegistry.get(minDistanceIndex);
    }

    addNodeFilter$ = createEffect(
        () =>
            this.selectFinalMatcheNodesFromSearch$.pipe(
                mergeMap((c) => {
                    let addPubKeyFilter = [];
                    if (c)
                        addPubKeyFilter.push(
                            filterActions.addChannelFilter({
                                value: {
                                    interpreter: 'javascript',
                                    source: `return (channel) => 
    channel.policies.some((p) => 
        p.public_key === "${c.public_key}")
`.trim(),
                                    function: (channel: LndChannel) =>
                                        channel.policies.some((p) => p.public_key === c.public_key),
                                    issueId: 'addNodeFilter',
                                },
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
