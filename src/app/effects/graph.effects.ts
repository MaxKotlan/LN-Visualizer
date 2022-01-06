import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LndChannel, LndNode } from 'api/src/models';
import { ChunkInfo } from 'api/src/models/chunkInfo.interface';
import { LndChannelWithParent, LndNodeWithPosition } from 'api/src/models/node-position.interface';
import { catchError, filter, from, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import * as graphActions from '../actions/graph.actions';
import { LndApiServiceService } from '../services/lnd-api-service.service';
import { Chunk } from '../types/chunk.interface';
import { createSpherePoint } from '../utils';
import * as THREE from 'three';
import { MaxPriorityQueue } from '@datastructures-js/priority-queue';
import {
    selectChannelSetValue,
    selectChannelSetKeyValue,
    selectNodeSetKeyValue,
    selectNodeSetValue,
} from '../selectors/graph.selectors';
import { GraphState } from '../reducers/graph.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class GraphEffects {
    constructor(
        private actions$: Actions,
        private store$: Store<GraphState>,
        private lndApiServiceService: LndApiServiceService,
    ) {
        //this.store$.select(selectChannelSetValue).subscribe((nsv) => console.log(nsv.length));
    }

    retrieveGraph$ = createEffect(() =>
        this.actions$.pipe(
            ofType(graphActions.requestGraph),
            mergeMap(() =>
                this.lndApiServiceService.getGraphInfo().pipe(
                    map((graph) => graphActions.requestGraphSuccess({ graph })),
                    catchError((error: HttpErrorResponse) =>
                        of(graphActions.requestGraphFailure({ error })),
                    ),
                ),
            ),
        ),
    );

    onChunkInfo$ = createEffect(() =>
        this.lndApiServiceService.initialChunkSync().pipe(
            filter((chunk) => chunk.type === 'chunkInfo'),
            map((chunk) => chunk as unknown as ChunkInfo),
            tap(console.log),
            map((chunkInfo) => graphActions.processChunkInfo({ chunkInfo })),
        ),
    );

    onNodeChunk$ = createEffect(() =>
        this.lndApiServiceService.initialChunkSync().pipe(
            filter((chunk) => chunk.type === 'node'),
            map((chunk) => graphActions.processGraphNodeChunk({ chunk: chunk as Chunk<LndNode> })),
        ),
    );

    onChannelChunk$ = createEffect(() =>
        this.lndApiServiceService.initialChunkSync().pipe(
            filter((chunk) => chunk.type === 'channel'),
            map((chunk) =>
                graphActions.processGraphChannelChunk({ chunk: chunk as Chunk<LndChannel> }),
            ),
        ),
    );

    private readonly origin = new THREE.Vector3(0, 0, 0);

    private selectOtherNodeInChannel(selfPubkey: string, channel: LndChannel): string {
        if (channel.policies[0].public_key === selfPubkey) return channel.policies[1].public_key;
        if (channel.policies[1].public_key === selfPubkey) return channel.policies[0].public_key;
        console.log('Uh oh');
        return '' as string;
    }

    private getNodeQueueComparitor(nodeSet: Record<string, LndNodeWithPosition>) {
        return {
            compare: (a: LndChannelWithParent, b: LndChannelWithParent): number => {
                const otherNodeAPubKey = this.selectOtherNodeInChannel(a.parent.public_key, a);
                const otherNodeBPubKey = this.selectOtherNodeInChannel(b.parent.public_key, b);
                const a1 = nodeSet[otherNodeAPubKey]; //.connectedChannels.size();
                const b1 = nodeSet[otherNodeBPubKey]; //.connectedChannels.size();

                if (!a1) return 0;
                if (!b1) return 0;

                const c = a1.connectedChannels.size();
                const d = b1.connectedChannels.size();
                return c - d;
            },
        };
    }

    positionNodes$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.processGraphNodeChunk),
                withLatestFrom(this.store$.select(selectNodeSetKeyValue)),
                map(([action, nodeRegistry]) =>
                    action.chunk.data.reduce((acc, node) => {
                        acc[node.public_key] = {
                            ...node,
                            position: createSpherePoint(1, this.origin, node.public_key),
                            connectedChannels: new MaxPriorityQueue<LndChannelWithParent>(
                                this.getNodeQueueComparitor(nodeRegistry),
                            ),
                            parent: null,
                        };
                        return acc;
                    }, {} as Record<string, LndNodeWithPosition>),
                ),
                map((nodeSubSet: Record<string, LndNodeWithPosition>) =>
                    graphActions.concatinateNodeChunk({ nodeSubSet }),
                ),
            ),
        { dispatch: true },
    );

    private enqueueChannel(lndNode: LndNodeWithPosition, channel: LndChannel) {
        if (!lndNode) return;
        lndNode.connectedChannels.enqueue({ ...channel, parent: lndNode });
    }

    positionChannels$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.processGraphChannelChunk),
                withLatestFrom(this.store$.select(selectNodeSetKeyValue)),
                tap(([action, nodeRegistry]) =>
                    action.chunk.data.forEach((channel: LndChannel) => {
                        const node1 = nodeRegistry[channel.policies[0].public_key];
                        const node2 = nodeRegistry[channel.policies[1].public_key];

                        if (!node1) return;
                        if (!node2) return;

                        this.enqueueChannel(node1, channel);
                        this.enqueueChannel(node2, channel);

                        const chnl: LndChannelWithParent =
                            node1.connectedChannels.front() as LndChannelWithParent;
                        const potentialParent1 =
                            nodeRegistry[this.selectOtherNodeInChannel(node1.public_key, chnl)];

                        if (
                            node1.connectedChannels.size() <
                            potentialParent1.connectedChannels.size()
                        )
                            node1.parent = potentialParent1;

                        const chn2: LndChannelWithParent =
                            node2.connectedChannels.front() as LndChannelWithParent;
                        const potentialParent2 =
                            nodeRegistry[this.selectOtherNodeInChannel(node2.public_key, chn2)];

                        if (
                            node2.connectedChannels.size() <
                            potentialParent2.connectedChannels.size()
                        )
                            node2.parent = potentialParent2;
                    }),
                ),
                map(([action, nodeRegistry]) => {
                    const chnlRegistry = action.chunk.data.reduce((acc, channel) => {
                        acc[channel.id] = channel;
                        return acc;
                    }, {} as Record<string, LndChannel>);
                    return [chnlRegistry, nodeRegistry] as [
                        Record<string, LndChannel>,
                        Record<string, LndNodeWithPosition>,
                    ];
                }),
                mergeMap(
                    ([chnlRegistry, nodeRegistry]: [
                        Record<string, LndChannel>,
                        Record<string, LndNodeWithPosition>,
                    ]) =>
                        from([
                            graphActions.graphNodePositionRecalculate({ nodeSet: nodeRegistry }),
                            graphActions.concatinateChannelChunk({ channelSubSet: chnlRegistry }),
                        ]),
                    //console.log(Object.values(nodeRegistry).filter((n) => !n.parent).length),
                ),
                // map((nodeSet: Record<string, LndNodeWithPosition>) =>
                //     graphActions.cacheProcessedGraphNodeChunk({ nodeSet }),
                // ),
            ),
        { dispatch: true },
    );

    positionRecalculate$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.graphNodePositionRecalculate),
                tap((action) =>
                    Object.values(action.nodeSet).forEach((node) => {
                        if (node.parent) {
                            node.position = createSpherePoint(
                                0.1,
                                node.parent.position,
                                node.public_key.slice(0, 10),
                            );
                        }
                    }),
                ),
                map((action) => graphActions.concatinateNodeChunk({ nodeSubSet: action.nodeSet })),
            ),
        { dispatch: true },
    );

    concatinateNodeChunk$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.concatinateNodeChunk),
                withLatestFrom(this.store$.select(selectNodeSetKeyValue)),
                map(([action, nodeState]) => {
                    // const res = nodeState.reduce((acc, node) => {
                    //     acc[node.public_key] = node;
                    //     return acc;
                    // }, action.nodeSubSet);
                    // console.log(action.nodeSubSet);
                    return graphActions.cacheProcessedGraphNodeChunk({
                        nodeSet: { ...nodeState, ...action.nodeSubSet },
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
                    return graphActions.cacheProcessedChannelChunk({
                        channelSet: { ...action.channelSubSet, ...channelState },
                    });
                }),
            ),
        { dispatch: true },
    );

    // private calculatePositionFromParent = (n: LnModifiedGraphNode, depth = 2) => {
    //     n.children.forEach((child) => {
    //         child.postition = createSpherePoint(1 / depth, n.postition, n.pub_key.slice(0, 10));
    //         calculatePositionFromParent(child, depth + 1);
    //     });
    // };
}
function selectChannelValue(selectChannelValue: any) {
    throw new Error('Function not implemented.');
}
