import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import _ from 'lodash';
import { combineLatest, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { LndChannel } from 'src/app/types/channels.interface';
import { LndChannelWithParent, LndNodeWithPosition } from 'src/app/types/node-position.interface';
import { LndNode } from 'src/app/types/node.interface';
import { Vector3 } from 'three';
import * as filterSelectors from 'src/app/filter-engine/controls-graph-filter/selectors/filter.selectors';
import { FilterEvaluatorService } from 'src/app/filter-engine/controls-graph-filter/services/filter-evaluator.service';
import {
    FilteredStatisticsCalculatorService,
    GlobalStatisticsCalculatorService,
} from 'src/app/graph-data/graph-statistics/services';
import { NodeFeatureCheckerService } from 'src/app/ui/node-features/services';
import * as graphActions from 'src/app/graph-data/graph-process-data/actions';
import { GraphState } from '../../../renderer/graph-renderer/reducer';
import {
    FilteredChannelRegistryService,
    FilteredNodeRegistryService,
    NodeRegistryService,
    PointTreeService,
} from 'src/app/graph-data/data-registries/services';

@Injectable()
export class NodeEffects {
    constructor(
        private actions$: Actions,
        private store$: Store<GraphState>,
        private globalStatisticsCaluclator: GlobalStatisticsCalculatorService,
        private evaluationService: FilterEvaluatorService,
        private nodeRegistry: NodeRegistryService,
        private filteredNodeRegistryService: FilteredNodeRegistryService,
        private filteredChannelRegistryService: FilteredChannelRegistryService,
        private filteredStatisticsCalculator: FilteredStatisticsCalculatorService,
        private filterEvaluationService: FilterEvaluatorService,
        private nodeFeatureCheckerService: NodeFeatureCheckerService,
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

    computeGlobalNodeStatistics$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.cacheProcessedGraphNodeChunk),
                debounceTime(250),
                map(() => {
                    this.nodeRegistry.forEach((node) => {
                        this.globalStatisticsCaluclator.checkNode(node);
                        this.nodeFeatureCheckerService.checkNodeForNewFeatures(node);
                    });
                    this.globalStatisticsCaluclator.updateStore();
                    this.nodeFeatureCheckerService.updateStore();
                    return graphActions.nodeStatisticsComputationFinished();
                }),
            ),
        { dispatch: true },
    );

    filterNodesCache$ = createEffect(
        () =>
            combineLatest([
                this.actions$.pipe(
                    ofType(graphActions.nodeStatisticsComputationFinished),
                    debounceTime(250),
                ),
                this.store$
                    .select(filterSelectors.activeNodeFilters)
                    .pipe(distinctUntilChanged(_.isEqual), debounceTime(100)),
            ]).pipe(
                map(([, activeNodeFilters]) => {
                    this.filteredNodeRegistryService.clear();
                    this.filteredStatisticsCalculator.resetFilterStatistics();
                    this.nodeRegistry.forEach((node) => {
                        if (this.evaluationService.evaluateFilters(node, activeNodeFilters)) {
                            this.filteredNodeRegistryService.set(node.public_key, node);
                            this.filteredStatisticsCalculator.checkNode(node);
                        }
                    });
                    this.filteredStatisticsCalculator.updateStore();
                    this.pointTreeService.buildKDTree();
                    return graphActions.setFilteredNodes();
                }),
            ),
        { dispatch: true },
    );

    filterNodesChannelCache$ = createEffect(
        () =>
            combineLatest([
                this.store$
                    .select(filterSelectors.activeChannelFilters)
                    .pipe(distinctUntilChanged(_.isEqual), debounceTime(100)),
                this.actions$.pipe(ofType(graphActions.setFilteredNodes)),
            ]).pipe(
                map(([filters]) => {
                    this.filteredChannelRegistryService.clear();
                    this.filteredStatisticsCalculator.resetFilterStatistics();
                    this.filteredNodeRegistryService.forEach((node) => {
                        node.connected_channels.forEach((channel) => {
                            if (
                                this.areBothNodesInFilteredView(channel) &&
                                this.filterEvaluationService.evaluateFilters(channel, filters) &&
                                !this.filteredChannelRegistryService.has(channel.id)
                            ) {
                                this.filteredChannelRegistryService.set(
                                    (channel as unknown as LndChannelWithParent)
                                        .id as unknown as string,
                                    channel as unknown as LndChannel,
                                );
                                this.filteredStatisticsCalculator.checkChannel(channel);
                            }
                        });
                    });
                    this.filteredStatisticsCalculator.updateStore();
                    return graphActions.setFilteredNodeChannels();
                }),
            ),
        { dispatch: true },
    );

    public areBothNodesInFilteredView(channel: LndChannel) {
        return channel.policies.every((p) => this.filteredNodeRegistryService.has(p.public_key));
    }

    computeFilteredStatistics$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.setFilteredNodeChannels),
                map(() => {
                    this.filteredNodeRegistryService.forEach((node) => {
                        this.filteredStatisticsCalculator.checkNode(node);
                    });
                    this.filteredStatisticsCalculator.updateStore();
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
                            node_channel_count: 0,
                        } as LndNodeWithPosition;
                    });
                }),
                map((nodeSubSet) => graphActions.concatinateNodeChunk({ nodeSubSet })),
            ),
        { dispatch: true },
    );
}
