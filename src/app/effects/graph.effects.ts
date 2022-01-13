import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaxPriorityQueue, MinPriorityQueue } from '@datastructures-js/priority-queue';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LndChannel, LndNode } from 'api/src/models';
import { ChannelCloseEvent } from 'api/src/models/channel-close-event.interface';
import { ChunkInfo } from 'api/src/models/chunkInfo.interface';
import { LndChannelWithParent, LndNodeWithPosition } from 'api/src/models/node-position.interface';
import { map, mergeMap, of, switchMap, tap, throttleTime, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
import * as graphActions from '../actions/graph.actions';
import { GraphState } from '../reducers/graph.reducer';
import { selectChannelSetValue, selectNodeSetKeyValue } from '../selectors/graph.selectors';
import { LndApiServiceService } from '../services/lnd-api-service.service';
import { Chunk } from '../types/chunk.interface';
import { createSpherePoint } from '../utils';

@Injectable()
export class GraphEffects {
    constructor(
        private actions$: Actions,
        private store$: Store<GraphState>,
        private lndApiServiceService: LndApiServiceService,
        private snackBar: MatSnackBar,
    ) {
        // this.store$
        //     .select(selectNodeSetValue)
        //     .subscribe((nsv) =>
        //         console.log(
        //             'noChildren: ',
        //             nsv.filter((n) => Object.values(n.children).length === 0).length,
        //             'no parent',
        //             nsv.filter((n) => !n.parent).length,
        //         ),
        //     );
    }

    retrieveGraph$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.initializeGraphSyncProcess),
                mergeMap(() =>
                    this.lndApiServiceService.initialChunkSync().pipe(
                        map((data) => {
                            switch (data.type) {
                                case 'chunkInfo':
                                    return graphActions.processChunkInfo({
                                        chunkInfo: data as unknown as ChunkInfo,
                                    });
                                case 'node':
                                    return graphActions.processGraphNodeChunk({
                                        chunk: data as Chunk<LndNode>,
                                    });
                                case 'channel':
                                    return graphActions.processGraphChannelChunk({
                                        chunk: data as Chunk<LndChannel>,
                                    });
                                case 'channel-closed':
                                    return graphActions.channelClosed({
                                        channelId: (data as unknown as ChannelCloseEvent).data,
                                    });
                            }
                            return graphActions.errorUnknownChunkDataType();
                        }),
                    ),
                ),
            ),
        { dispatch: true },
    );

    private readonly origin = new THREE.Vector3(0, 0, 0);

    private selectOtherNodeInChannel(selfPubkey: string, channel: LndChannel): string {
        if (channel.policies[0].public_key === selfPubkey) return channel.policies[1].public_key;
        if (channel.policies[1].public_key === selfPubkey) return channel.policies[0].public_key;
        throw new Error('Public Key is not either of the nodes in the channel');
    }

    private getNodeQueueComparitor() {
        return {
            compare: (a: LndChannelWithParent, b: LndChannelWithParent): number => {
                /*Apprantely this was not doing anything... trying to compare capacities crashes browser*/

                // const otherNodeAPubKey = this.selectOtherNodeInChannel(a.parent.public_key, a);
                // const otherNodeBPubKey = this.selectOtherNodeInChannel(b.parent.public_key, b);
                // const a1 = nodeSet[otherNodeAPubKey]; //.connectedChannels.size();
                // const b1 = nodeSet[otherNodeBPubKey]; //.connectedChannels.size();

                // if (!a1) return -1;
                // if (!b1) return -1;

                // if (!a?.parent?.parent && !!b?.parent?.parent) return 1;
                // if (!b?.parent?.parent && !!a?.parent?.parent) return -1;
                // if (!b?.parent?.parent || !a?.parent?.parent) return 0;
                // // if (a.parent.parent?.connectedChannels.size() > )
                //if (!a?.parent?.parent || !b?.parent?.parent) return 0;
                //return b.policies[0].fee_rate > a.policies[0].fee_rate;

                // const alice = a.parent?.parent?.connectedChannels?.size();
                // const bob = b.parent?.parent?.connectedChannels?.size();

                // if (!alice || !bob) return -1;

                // if (alice > bob) return -1;
                // if (bob > alice) return 1;
                return 0;

                // ? return -1 : 1;

                //return; //b.capacity - a.capacity;
                // if (
                //     b.parent.parent.connectedChannels.size() >
                //     a.parent.parent.connectedChannels.size()
                // )
                //     return -1;
                // if (
                //     a.parent.parent.connectedChannels.size() >
                //     b.parent.parent.connectedChannels.size()
                // )
                //     return 1;
                // //return b.capacity > a.capacity ? 1 : -1;
                //return 0;
                // if (!a.capacity || !b.capacity) return 0;

                // if (a.capacity > b.capacity) return 1;
                // if (b.capacity > a.capacity) return -1;
                // return 0;

                // const c = a1.connectedChannels.size();
                // const d = b1.connectedChannels.size();
                // return c - d;
            },
        };
    }

    positionNodes$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.processGraphNodeChunk),
                map((action) => {
                    return action.chunk.data.map(
                        (lnNode: LndNode) =>
                            ({
                                ...lnNode,
                                position: createSpherePoint(1, this.origin, lnNode.public_key),
                                connectedChannels: new MinPriorityQueue<LndChannelWithParent>(
                                    this.getNodeQueueComparitor(),
                                ),
                                parent: null,
                                children: {},
                            } as LndNodeWithPosition),
                    );
                }),
                map((nodeSubSet) => graphActions.concatinateNodeChunk({ nodeSubSet })),
            ),
        { dispatch: false },
    );

    private enqueueChannel(
        lndNode: LndNodeWithPosition,
        otherNode: LndNodeWithPosition,
        channel: LndChannel,
    ) {
        if (!lndNode) return;
        const lndPar = channel as LndChannelWithParent;
        lndPar.parent = otherNode;
        lndNode.connectedChannels.enqueue(lndPar);
    }

    calculateNodeHeirarchy$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.processGraphChannelChunk),
                withLatestFrom(this.store$.select(selectNodeSetKeyValue)),
                tap(([action, nodeRegistry]) =>
                    action.chunk.data.forEach((channel: LndChannel) => {
                        const node1 = nodeRegistry.get(channel.policies[0].public_key);
                        const node2 = nodeRegistry.get(channel.policies[1].public_key);

                        if (!node1) return;
                        if (!node2) return;

                        this.enqueueChannel(node1, node2, channel);
                        this.enqueueChannel(node2, node1, channel);

                        const chnl: LndChannelWithParent =
                            node1.connectedChannels.front() as LndChannelWithParent;
                        const potentialParent1 = nodeRegistry.get(
                            this.selectOtherNodeInChannel(node1.public_key, chnl),
                        );

                        if (
                            potentialParent1 &&
                            node1.connectedChannels.size() <
                                potentialParent1.connectedChannels.size()
                        ) {
                            node1.parent = potentialParent1;
                            node1.parent.children[node1.public_key] = node1;
                        }

                        const chn2: LndChannelWithParent =
                            node2.connectedChannels.front() as LndChannelWithParent;
                        const potentialParent2 = nodeRegistry.get(
                            this.selectOtherNodeInChannel(node2.public_key, chn2),
                        );

                        if (
                            potentialParent2 &&
                            node2.connectedChannels.size() <
                                potentialParent2.connectedChannels.size()
                        ) {
                            node2.parent = potentialParent2;
                            node2.parent.children[node2.public_key] = node2;
                        }
                    }),
                ),
                map(([action, nodeRegistry]) => {
                    const chnlRegistry = action.chunk.data;
                    return [chnlRegistry, nodeRegistry] as [
                        LndChannel[],
                        Map<string, LndNodeWithPosition>,
                    ];
                }),
                map(([chnlRegistry]) =>
                    graphActions.concatinateChannelChunk({ channelSubSet: chnlRegistry }),
                ),
            ),
        { dispatch: true },
    );

    positionRecalculate$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.graphNodePositionRecalculate),
                tap((action) =>
                    // Object.values(action.nodeSet)
                    //     .filter((node) => !node.parent)
                    //     .forEach((unparentedNode) => {
                    //         // node.position = createSpherePoint(
                    //         //     0.1,
                    //         //     node.parent.position,
                    //         //     node.public_key.slice(0, 10),
                    //         // );

                    //         unparentedNode.position = createSpherePoint(
                    //             1,
                    //             this.origin,
                    //             unparentedNode.public_key.slice(0, 10),
                    //         );

                    //         this.calculatePositionFromParent(unparentedNode);
                    //     }),
                    action.nodeSet.forEach((node) => {
                        if (!node.parent) {
                            node.position = createSpherePoint(
                                1,
                                this.origin,
                                node.public_key.slice(0, 10),
                            );
                            this.calculatePositionFromParent(node);
                        }
                    }),
                ),
                map((action) =>
                    graphActions.cacheProcessedGraphNodeChunk({ nodeSet: action.nodeSet }),
                ),
            ),
        { dispatch: true },
    );

    public calculatePositionFromParent(node: LndNodeWithPosition, depth = 2) {
        if (depth > 30) {
            return;
        }
        Object.values(node.children).forEach((child) => {
            child.position = createSpherePoint(
                1 / depth,
                node.position,
                child.public_key.slice(0, 10),
            );
            this.calculatePositionFromParent(child, depth + 1);
        });
    }

    concatinateNodeChunk$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.concatinateNodeChunk),
                withLatestFrom(this.store$.select(selectNodeSetKeyValue)),
                map(([action, nodeState]) => {
                    action.nodeSubSet.forEach((node) => nodeState.set(node.public_key, node));
                    return graphActions.cacheProcessedGraphNodeChunk({
                        nodeSet: nodeState,
                    });
                }),
            ),
        { dispatch: true },
    );

    concatinateChannelChunk$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.concatinateChannelChunk),
                withLatestFrom(this.store$.select(selectChannelSetValue)),
                map(([action, channelState]) => {
                    const res = channelState.reduce((acc, chnl) => {
                        acc[chnl.id] = chnl;
                        return acc;
                    }, action.channelSubSet);
                    return graphActions.cacheProcessedChannelChunk({
                        channelSet: res,
                    });
                }),
            ),
        { dispatch: true },
    );

    recalculatePosition$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.cacheProcessedChannelChunk),
                withLatestFrom(this.store$.select(selectNodeSetKeyValue)),
                switchMap(([, nodeRegistry]) => {
                    // const res = channelState.reduce((acc, chnl) => {
                    //     acc[chnl.id] = chnl;
                    //     return acc;
                    // }, action.channelSubSet);
                    // return graphActions.cacheProcessedChannelChunk({
                    //     channelSet: { ...action.channelSubSet, ...channelState },
                    // });
                    return of(
                        graphActions.graphNodePositionRecalculate({ nodeSet: nodeRegistry }),
                    ).pipe(throttleTime(100));
                }),
            ),
        { dispatch: true },
    );

    //graphActions.graphNodePositionRecalculate({ nodeSet: nodeRegistry })

    // private calculatePositionFromParent = (n: LnModifiedGraphNode, depth = 2) => {
    //     n.children.forEach((child) => {
    //         child.postition = createSpherePoint(1 / depth, n.postition, n.pub_key.slice(0, 10));
    //         calculatePositionFromParent(child, depth + 1);
    //     });
    // };

    channelClosedEvent$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.channelClosed),
                tap((action) => this.snackBar.open(`Channel ${action.channelId} has closed`)),
            ),
        { dispatch: false },
    );
}
