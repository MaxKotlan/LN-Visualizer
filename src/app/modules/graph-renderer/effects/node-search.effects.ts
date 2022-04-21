import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LndChannel } from 'api/src/models';
import { combineLatest, from, map, mergeMap } from 'rxjs';
import { meshScale } from 'src/app/constants/mesh-scale.constant';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import { Uniform, Vector3 } from 'three';
import * as filterActions from '../../controls-graph-filter/actions';
import { selectSearchString } from '../../controls/selectors/controls.selectors';
import { FilteredNodeRegistryService } from '../services/filtered-node-registry/filtered-node-registry.service';

@Injectable()
export class NodeSearchEffects {
    constructor(
        private filteredNodeRegistry: FilteredNodeRegistryService,
        private store$: Store<any>,
    ) {}

    public selectPossibleNodesFromSearch$ = this.store$.select(selectSearchString).pipe(
        map((searchString) => {
            let possibleResults: LndNodeWithPosition[] = [];
            this.filteredNodeRegistry.forEach((a) => {
                if (
                    a.public_key.toUpperCase().includes(searchString.toUpperCase()) ||
                    a.alias.toUpperCase().includes(searchString.toUpperCase())
                ) {
                    possibleResults.push(a);
                }
            });
            return possibleResults;
        }),
    );

    public selectFinalMatcheNodesFromSearch$ = combineLatest([
        this.selectPossibleNodesFromSearch$,
        this.store$.select(selectSearchString),
    ]).pipe(
        map(([nodes, searchString]) => {
            if (nodes.length === 1) return nodes[0];
            const exactMatch = nodes.find(
                (node: LndNodeWithPosition) =>
                    searchString &&
                    searchString !== '' &&
                    searchString.length > 2 &&
                    (node.alias === searchString || node.public_key === searchString),
            );
            return exactMatch;
        }),
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

    // selectNodeSetKeyValue,
    // selectSearchString,
    // (nodes, searchString) => {
    //     let possibleResults: LndNodeWithPosition[] = [];
    //     nodes.forEach((a) => {
    //         if (
    //             a.public_key.toUpperCase().includes(searchString.toUpperCase()) ||
    //             a.alias.toUpperCase().includes(searchString.toUpperCase())
    //         ) {
    //             possibleResults.push(a);
    //         }
    //     });
    //     //possibleResults.sort((a, b) => b.children.size - a.children.size);
    //     return possibleResults;
    // },
}
