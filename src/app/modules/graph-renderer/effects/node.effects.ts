import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, from, map, mergeMap } from 'rxjs';
import { LndChannel } from 'src/app/types/channels.interface';
import { LndChannelWithParent, LndNodeWithPosition } from 'src/app/types/node-position.interface';
import { LndNode } from 'src/app/types/node.interface';
import { Vector3 } from 'three';
import * as filterSelectors from '../../controls-graph-filter/selectors/filter.selectors';
import { FilterEvaluatorService } from '../../controls-graph-filter/services/filter-evaluator.service';
import * as graphActions from '../actions/graph.actions';
import { GraphState } from '../reducer';
import * as graphSelectors from '../selectors';
import { FilteredChannelRegistryService } from '../services';
import { FilteredNodeRegistryService } from '../services/filtered-node-registry/filtered-node-registry.service';
import { MinMaxCalculatorService } from '../services/min-max-calculator/min-max-calculator.service';
import { NodeRegistryService } from '../services/node-registry/node-registry.service';

@Injectable()
export class NodeEffects {
    constructor(
        private actions$: Actions,
        private store$: Store<GraphState>,
        private minMaxCaluclator: MinMaxCalculatorService,
        private evaluationService: FilterEvaluatorService,
        private nodeRegistry: NodeRegistryService,
        private filteredNodeRegistryService: FilteredNodeRegistryService,
        private filteredChannelRegistryService: FilteredChannelRegistryService,
    ) {}

    concatinateNodeChunk$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.concatinateNodeChunk),
                map((action) => {
                    action.nodeSubSet.forEach((node) => {
                        this.nodeRegistry.set(node.public_key, node);
                    });
                    return graphActions.cacheProcessedGraphNodeChunk({ isFromDatabase: false });
                }),
            ),
        { dispatch: true },
    );

    computeStatistics$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.cacheProcessedGraphNodeChunk),
                map(() => {
                    this.nodeRegistry.forEach((node) => {
                        this.minMaxCaluclator.checkNode(node);
                    });
                    this.minMaxCaluclator.updateStore();
                    return graphActions.computeNodeStatistics();
                }),
            ),
        { dispatch: true },
    );

    filterNodesCache$ = createEffect(
        () =>
            combineLatest([
                this.actions$.pipe(ofType(graphActions.computeNodeStatistics)),
                this.store$.select(filterSelectors.activeNodeFilters).pipe(debounceTime(100)),
            ]).pipe(
                map(([, activeNodeFilters]) => {
                    this.filteredNodeRegistryService.clear();
                    this.nodeRegistry.forEach((node) => {
                        if (this.evaluationService.evaluateFilters(node, activeNodeFilters))
                            this.filteredNodeRegistryService.set(node.public_key, node);
                    });
                    return graphActions.setFilteredNodes({
                        nodeSet: this.filteredNodeRegistryService,
                    });
                }),
            ),
        { dispatch: true },
    );

    filterNodesChannelCache$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.setFilteredNodes),
                map((filteredNodes) => {
                    this.filteredChannelRegistryService.clear();
                    filteredNodes.nodeSet.forEach((node) => {
                        node.connectedChannels.forEach((channel) => {
                            this.filteredChannelRegistryService.set(
                                (channel as unknown as LndChannelWithParent)
                                    .id as unknown as string,
                                channel as unknown as LndChannel,
                            );
                        });
                    });
                    return graphActions.setFilteredNodeChannels();
                }),
            ),
        { dispatch: true },
    );

    positionNodes$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.processGraphNodeChunk),
                map((action) => {
                    return action.chunk.data.map((lnNode: LndNode) => {
                        return {
                            ...lnNode,
                            position: new Vector3(
                                lnNode['position'].x,
                                lnNode['position'].y,
                                lnNode['position'].z,
                            ),
                            connectedChannels: new Map(),
                            node_capacity: 0,
                            channel_count: 0,
                        } as LndNodeWithPosition;
                    });
                }),
                map((nodeSubSet) => graphActions.concatinateNodeChunk({ nodeSubSet })),
            ),
        { dispatch: true },
    );
}
