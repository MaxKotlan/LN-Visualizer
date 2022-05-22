import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, distinctUntilChanged, from, map, mergeMap, take } from 'rxjs';
import { LndChannel } from 'src/app/types/channels.interface';
import { LndChannelWithParent, LndNodeWithPosition } from 'src/app/types/node-position.interface';
import { LndNode } from 'src/app/types/node.interface';
import { Vector3 } from 'three';
import * as filterSelectors from '../../controls-graph-filter/selectors/filter.selectors';
import { FilterEvaluatorService } from '../../controls-graph-filter/services/filter-evaluator.service';
import * as graphActions from '../actions/graph.actions';
import { GraphState } from '../reducer';
import { FilteredChannelRegistryService } from '../services';
import { FilteredNodeRegistryService } from '../services/filtered-node-registry/filtered-node-registry.service';
import { NodeRegistryService } from '../services/node-registry/node-registry.service';
import _ from 'lodash';
import { PointTreeService } from '../services/point-tree/point-tree.service';
import {
    FilteredStatisticsCalculatorService,
    GlobalStatisticsCalculatorService,
} from '../../graph-statistics/services';

@Injectable()
export class NodeEffects {
    constructor(
        private actions$: Actions,
        private store$: Store<GraphState>,
        private globalStatisticsCaluclator: GlobalStatisticsCalculatorService,
        private filteredStatisticsCaluclator: FilteredStatisticsCalculatorService,
        private evaluationService: FilterEvaluatorService,
        private nodeRegistry: NodeRegistryService,
        private filteredNodeRegistryService: FilteredNodeRegistryService,
        private filteredChannelRegistryService: FilteredChannelRegistryService,
        private pointTreeService: PointTreeService,
    ) {}

    concatinateNodeChunk$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.concatinateNodeChunk),
                map((action) => {
                    action.nodeSubSet.forEach((node) => {
                        this.nodeRegistry.set(node.public_key, node);
                    });
                    return graphActions.cacheProcessedGraphNodeChunk();
                }),
            ),
        { dispatch: true },
    );

    computeGlobalStatistics$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.cacheProcessedGraphNodeChunk),
                map(() => {
                    this.nodeRegistry.forEach((node) => {
                        this.globalStatisticsCaluclator.checkNode(node);
                    });
                    this.globalStatisticsCaluclator.updateStore();
                    return graphActions.computeNodeStatistics();
                }),
            ),
        { dispatch: true },
    );

    filterNodesCache$ = createEffect(
        () =>
            combineLatest([
                this.actions$.pipe(ofType(graphActions.computeNodeStatistics)),
                this.store$
                    .select(filterSelectors.activeNodeFilters)
                    .pipe(distinctUntilChanged(_.isEqual), debounceTime(100)),
            ]).pipe(
                map(([, activeNodeFilters]) => {
                    this.filteredNodeRegistryService.clear();
                    this.nodeRegistry.forEach((node) => {
                        if (this.evaluationService.evaluateFilters(node, activeNodeFilters))
                            this.filteredNodeRegistryService.set(node.public_key, node);
                    });
                    this.pointTreeService.buildKDTree();
                    return graphActions.setFilteredNodes();
                }),
            ),
        { dispatch: true },
    );

    filterNodesChannelCache$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.setFilteredNodes),
                map(() => {
                    this.filteredChannelRegistryService.clear();
                    this.filteredNodeRegistryService.forEach((node) => {
                        node.connected_channels.forEach((channel) => {
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

    computeFilteredStatistics$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.setFilteredNodeChannels),
                map(() => {
                    this.filteredNodeRegistryService.forEach((node) => {
                        this.filteredStatisticsCaluclator.checkNode(node);
                    });
                    this.filteredStatisticsCaluclator.updateStore();
                }),
            ),
        { dispatch: false },
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
                            connected_channels: new Map(),
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
