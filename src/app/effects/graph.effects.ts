import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaxPriorityQueue, MinPriorityQueue } from '@datastructures-js/priority-queue';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LndChannel, LndNode } from 'api/src/models';
import { ChannelCloseEvent } from 'api/src/models/channel-close-event.interface';
import { ChunkInfo } from 'api/src/models/chunkInfo.interface';
import { LndChannelWithParent, LndNodeWithPosition } from 'src/app/types/node-position.interface';
import {
    catchError,
    delay,
    map,
    mergeMap,
    of,
    switchMap,
    tap,
    throttleTime,
    withLatestFrom,
} from 'rxjs';
import * as THREE from 'three';
import * as graphActions from '../actions/graph.actions';
import { GraphState } from '../reducers/graph.reducer';
import { selectChannelSetKeyValue, selectNodeSetKeyValue } from '../selectors/graph.selectors';
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
                        catchError((e: ErrorEvent) => {
                            this.snackBar.open('Failed to connect to websocket', 'close');
                            return of(graphActions.initializeGraphSyncProcess()).pipe(delay(1000));
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

                // const hexStringA = a.parent.color;
                // const j = parseInt(hexStringA.slice(1, 6), 16);

                // const hexStringB = b.parent.color;
                // const m = parseInt(hexStringB.slice(1, 6), 16);

                //j.
                // if (alice > bob) return -1;
                // if (bob > alice) return 1;
                //retur; //Math.random() > 0.5 ? 1 : -1;

                // if (j > m) return -1;
                // if (m > j) return 1;

                if (!b.parent.parent?.children.size && !a.parent.parent?.children.size) return 0;
                if (b.parent.parent?.children.size && !a.parent.parent?.children.size) return -1;
                if (!b.parent.parent?.children.size && a.parent.parent?.children.size) return 1;

                if (b.parent.parent!.children.size > a.parent.parent!.children.size) return -1;
                if (a.parent.parent!.children.size > b.parent.parent!.children.size) return 1;
                return b.parent.children.size - a.parent.children.size;

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
                    return action.chunk.data.map((lnNode: LndNode) => {
                        const initPos = new THREE.Vector3(0, 0, 0);
                        createSpherePoint(1, this.origin, lnNode.public_key, initPos);
                        return {
                            ...lnNode,
                            position: initPos,
                            connectedChannels: new MaxPriorityQueue<LndChannelWithParent>(
                                this.getNodeQueueComparitor(),
                            ),
                            parent: null,
                            children: new Map<string, LndNodeWithPosition>(),
                            totalCapacity: 0,
                        } as LndNodeWithPosition;
                    });
                }),
                map((nodeSubSet) => graphActions.concatinateNodeChunk({ nodeSubSet })),
            ),
        { dispatch: true },
    );

    private enqueueChannel(
        lndNode: LndNodeWithPosition,
        otherNode: LndNodeWithPosition,
        channel: LndChannel,
    ) {
        if (!lndNode) return;
        const lndPar = channel as LndChannelWithParent;
        lndPar.parent = otherNode;
        lndNode.totalCapacity += channel.capacity;
        lndNode.connectedChannels.enqueue(lndPar);
    }

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
                    let pcount = 0;
                    nodeRegistry.nodeSet.forEach((node) => {
                        if (node.parent) {
                            pcount++;
                        }
                    });
                    console.log('Parent Count: ', pcount, 'Size :', nodeRegistry.nodeSet.size);
                    return graphActions.concatinateChannelChunk({
                        channelSubSet: action.chunk.data,
                    });
                }),
                // map(([action, nodeRegistry]) => {
                //     return action.chunk.data;
                //     //const chnlRegistry = action.chunk.data;
                //     // return [chnlRegistry, nodeRegistry] as [
                //     //     LndChannel[],
                //     //     Map<string, LndNodeWithPosition>,
                //     // ];
                // }),
                // map((chnlRegistry) =>
                //     graphActions.concatinateChannelChunk({ channelSubSet: chnlRegistry }),
                // ),
            ),
        { dispatch: true },
    );

    positionRecalculate$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.graphNodePositionRecalculate),
                // tap((action) =>
                //     // Object.values(action.nodeSet)
                //     //     .filter((node) => !node.parent)
                //     //     .forEach((unparentedNode) => {
                //     //         // node.position = createSpherePoint(
                //     //         //     0.1,
                //     //         //     node.parent.position,
                //     //         //     node.public_key.slice(0, 10),
                //     //         // );

                //     //         unparentedNode.position = createSpherePoint(
                //     //             1,
                //     //             this.origin,
                //     //             unparentedNode.public_key.slice(0, 10),
                //     //         );

                //     //         this.calculatePositionFromParent(unparentedNode);
                //     //     }),
                //     action.nodeSet.forEach((node) => {
                //         if (!node.parent) {
                //             node.position = createSpherePoint(
                //                 1,
                //                 this.origin,
                //                 node.public_key.slice(0, 10),
                //             );
                //             this.calculatePositionFromParent(node);
                //         }
                //     }),
                // ),
                map((action) => {
                    action.nodeSet.forEach((node) => {
                        if (!node.parent) {
                            createSpherePoint(
                                1,
                                this.origin,
                                node.public_key.slice(0, 10),
                                node.position,
                            );
                            this.calculatePositionFromParent(node);
                        }
                    });
                    return graphActions.cacheProcessedGraphNodeChunk({
                        //do I need to sort the map?
                        nodeSet: new Map(
                            [...action.nodeSet.entries()].sort(
                                (a, b) =>
                                    b[1].connectedChannels.size() - a[1].connectedChannels.size(),
                            ),
                        ),
                        //nodeSet: action.nodeSet,
                    });
                }),
            ),
        { dispatch: true },
    );

    public calculatePositionFromParent(node: LndNodeWithPosition, depth = 2) {
        if (depth > 30) {
            return;
        }
        node.children.forEach((child) => {
            createSpherePoint(
                1 / depth,
                node.position,
                // .clone()
                // .sub(node.parent?.position.clone().multiplyScalar(1 / depth) || this.origin),
                child.public_key.slice(0, 10),
                child.position,
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
                withLatestFrom(this.store$.select(selectChannelSetKeyValue)),
                map(([action, channelState]) => {
                    // const res = channelState.reduce((acc, chnl) => {
                    //     acc[chnl.id] = chnl;
                    //     return acc;
                    // }, action.channelSubSet);
                    action.channelSubSet.forEach((channel) => {
                        channelState.set(channel.id, channel);
                    });
                    return graphActions.cacheProcessedChannelChunk({
                        channelSet: channelState,
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
                    return of(
                        graphActions.graphNodePositionRecalculate({ nodeSet: nodeRegistry }),
                    ).pipe(throttleTime(800));
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
        { dispatch: true },
    );
}
