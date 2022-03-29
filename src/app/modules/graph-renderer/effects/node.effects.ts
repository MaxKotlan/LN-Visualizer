import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, from, map, mergeMap, withLatestFrom } from 'rxjs';
import { initialSphereSize } from 'src/app/constants/mesh-scale.constant';
import { GraphState } from '../reducer';
import { createSpherePoint } from '../utils';
import * as THREE from 'three';
import * as graphActions from '../actions/graph.actions';
import * as graphSelectors from '../selectors';
import * as filterActions from '../../controls-graph-filter/actions';
import * as filterSelectors from '../../controls-graph-filter/selectors/filter.selectors';
import { LndNode } from 'src/app/types/node.interface';
import { LndChannelWithParent, LndNodeWithPosition } from 'src/app/types/node-position.interface';
import { MaxPriorityQueue } from '@datastructures-js/priority-queue';
import { selectNodeSetKeyValue } from '../selectors';
import { LndChannel } from 'src/app/types/channels.interface';
import { MinMaxCalculatorService } from '../services/min-max-calculator/min-max-calculator.service';
import { FilterEvaluatorService } from '../../controls-graph-filter/services/filter-evaluator.service';

@Injectable()
export class NodeEffects {
    constructor(
        private actions$: Actions,
        private store$: Store<GraphState>,
        private minMaxCaluclator: MinMaxCalculatorService,
        private evaluationService: FilterEvaluatorService,
    ) {}

    private readonly origin = new THREE.Vector3(0, 0, 0);

    concatinateNodeChunk$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.concatinateNodeChunk),
                withLatestFrom(this.store$.select(selectNodeSetKeyValue)),
                map(([action, nodeState]) => {
                    action.nodeSubSet.forEach((node) => {
                        nodeState.set(node.public_key, node);
                    });

                    return graphActions.cacheProcessedGraphNodeChunk({
                        nodeSet: nodeState,
                    });
                }),
            ),
        { dispatch: true },
    );

    computeStatistics$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.cacheProcessedGraphNodeChunk),
                map((cacheProcessedGraphNodeChunk) => {
                    cacheProcessedGraphNodeChunk.nodeSet.forEach((node) => {
                        this.minMaxCaluclator.checkNode(node);
                    });
                    return graphActions.computeNodeStatistics({
                        nodeSet: cacheProcessedGraphNodeChunk.nodeSet,
                    });
                }),
            ),
        { dispatch: true },
    );

    public filteredSet: Map<string, LndNodeWithPosition> = new Map<string, LndNodeWithPosition>();

    filterNodesCache$ = createEffect(
        () =>
            combineLatest([
                this.actions$.pipe(ofType(graphActions.computeNodeStatistics)),
                this.store$.select(filterSelectors.activeNodeFilters).pipe(debounceTime(100)),
            ]).pipe(
                map(([cacheProcessedGraphNodeChunk, activeNodeFilters]) => {
                    this.filteredSet.clear();
                    cacheProcessedGraphNodeChunk.nodeSet.forEach((node) => {
                        if (this.evaluationService.evaluateFilters(node, activeNodeFilters))
                            this.filteredSet.set(node.public_key, node);
                    });
                    return graphActions.setFilteredNodes({
                        nodeSet: this.filteredSet,
                    });
                }),
            ),
        { dispatch: true },
    );

    public filterNodeCache: Map<string, LndChannel> = new Map<string, LndChannel>();

    filterNodesChannelCache$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.setFilteredNodes),
                map((filteredNodes) => {
                    this.filterNodeCache.clear();
                    filteredNodes.nodeSet.forEach((node) => {
                        node.connectedChannels.toArray().forEach((channel) => {
                            this.filterNodeCache.set(
                                (channel as unknown as LndChannelWithParent)
                                    .id as unknown as string,
                                channel as unknown as LndChannel,
                            );
                        });
                    });
                    return graphActions.setFilteredNodeChannels({
                        channelSet: this.filterNodeCache,
                    });
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
                        const initPos = new THREE.Vector3(0, 0, 0);
                        createSpherePoint(
                            initialSphereSize,
                            this.origin,
                            lnNode.public_key,
                            initPos,
                        );
                        return {
                            ...lnNode,
                            position: initPos,
                            connectedChannels: new MaxPriorityQueue<LndChannelWithParent>(
                                this.getNodeQueueComparitor(),
                            ),
                            parent: null,
                            children: new Map<string, LndNodeWithPosition>(),
                            node_capacity: 0,
                            channel_count: 0,
                            visited: false,
                            depth: 1,
                        } as LndNodeWithPosition;
                    });
                }),
                map((nodeSubSet) => graphActions.concatinateNodeChunk({ nodeSubSet })),
            ),
        { dispatch: true },
    );

    calculateNodeHeirarchy$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.processGraphChannelChunk),
                withLatestFrom(
                    this.actions$.pipe(ofType(graphActions.cacheProcessedGraphNodeChunk)),
                ),
                map(([action, nodeRegistry]) => {
                    action.chunk.data.forEach((channel: LndChannel) => {
                        const node1 = nodeRegistry.nodeSet.get(channel.policies[0].public_key);
                        const node2 = nodeRegistry.nodeSet.get(channel.policies[1].public_key);

                        if (!node1) return;
                        if (!node2) return;

                        this.enqueueChannel(node1, node1, channel);

                        const chnl: LndChannelWithParent =
                            node1.connectedChannels.front() as LndChannelWithParent;
                        const potentialParent1 = nodeRegistry.nodeSet.get(
                            this.selectOtherNodeInChannel(node1.public_key, chnl),
                        );

                        if (
                            potentialParent1 &&
                            node1.connectedChannels.size() <
                                potentialParent1.connectedChannels.size() &&
                            !node1.parent
                        ) {
                            node1.parent = potentialParent1;
                            node1.parent.children.set(node1.public_key, node1);
                        }

                        this.enqueueChannel(node2, node2, channel);

                        const chn2: LndChannelWithParent =
                            node2.connectedChannels.front() as LndChannelWithParent;
                        const potentialParent2 = nodeRegistry.nodeSet.get(
                            this.selectOtherNodeInChannel(node2.public_key, chn2),
                        );

                        if (
                            potentialParent2 &&
                            node2.connectedChannels.size() <
                                potentialParent2.connectedChannels.size() &&
                            !node2.parent
                        ) {
                            node2.parent = potentialParent2;
                            node2.parent.children.set(node2.public_key, node2);
                        }
                    });
                    return graphActions.concatinateChannelChunk({
                        channelSubSet: action.chunk.data,
                    });
                }),
            ),
        { dispatch: true },
    );

    positionRecalculate$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.graphNodePositionRecalculate),
                map((action) => {
                    const queue: LndNodeWithPosition[] = [];

                    action.nodeSet.forEach((node) => {
                        node.visited = false;
                        if (!node.parent) {
                            createSpherePoint(
                                initialSphereSize,
                                this.origin,
                                node.public_key.slice(0, 10),
                                node.position,
                            );
                            queue.push(node);
                        }
                    });

                    while (queue.length > 0) {
                        const v = queue.pop();

                        v.children.forEach((w) => {
                            if (!w.visited) {
                                w.depth = v.depth + 1;
                                createSpherePoint(
                                    initialSphereSize / w.depth,
                                    v.position,
                                    w.public_key.slice(0, 10),
                                    w.position,
                                );
                                queue.push(w);
                                w.visited = true;
                            }
                        });
                    }

                    return graphActions.cacheProcessedGraphNodeChunk({
                        //do I need to sort the map?
                        nodeSet: new Map(
                            [...action.nodeSet.entries()].sort(
                                (a, b) =>
                                    b[1].connectedChannels.size() - a[1].connectedChannels.size(),
                            ),
                        ),
                    });
                }),
            ),
        { dispatch: true },
    );

    addNodeFilter$ = createEffect(
        () =>
            this.store$.select(graphSelectors.selectFinalMatcheNodesFromSearch).pipe(
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

    private selectOtherNodeInChannel(selfPubkey: string, channel: LndChannel): string {
        if (channel.policies[0].public_key === selfPubkey) return channel.policies[1].public_key;
        if (channel.policies[1].public_key === selfPubkey) return channel.policies[0].public_key;
        throw new Error('Public Key is not either of the nodes in the channel');
    }

    private enqueueChannel(
        lndNode: LndNodeWithPosition,
        otherNode: LndNodeWithPosition,
        channel: LndChannel,
    ) {
        if (!lndNode) return;
        const lndPar = channel as LndChannelWithParent;
        lndPar.parent = otherNode;
        lndNode.node_capacity += channel.capacity;
        lndNode.channel_count += 1;
        lndNode.connectedChannels.enqueue(lndPar);
    }

    private getNodeQueueComparitor() {
        return {
            compare: (a: LndChannelWithParent, b: LndChannelWithParent): number => {
                if (!b.parent.parent?.children.size && !a.parent.parent?.children.size) return 0;
                if (b.parent.parent?.children.size && !a.parent.parent?.children.size) return -1;
                if (!b.parent.parent?.children.size && a.parent.parent?.children.size) return 1;

                if (b.parent.parent!.children.size > a.parent.parent!.children.size) return -1;
                if (a.parent.parent!.children.size > b.parent.parent!.children.size) return 1;
                return b.parent.children.size - a.parent.children.size;
            },
        };
    }
}
