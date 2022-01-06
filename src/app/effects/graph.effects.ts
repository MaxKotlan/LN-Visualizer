import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LndChannel, LndNode } from 'api/src/models';
import { ChunkInfo } from 'api/src/models/chunkInfo.interface';
import { LndChannelWithParent, LndNodeWithPosition } from 'api/src/models/node-position.interface';
import { catchError, filter, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import * as graphActions from '../actions/graph.actions';
import { LndApiServiceService } from '../services/lnd-api-service.service';
import { Chunk } from '../types/chunk.interface';
import { createSpherePoint } from '../utils';
import * as THREE from 'three';
import { MaxPriorityQueue } from '@datastructures-js/priority-queue';
import { selectNodeSetKeyValue, selectNodeSetValue } from '../selectors/graph.selectors';
import { GraphState } from '../reducers/graph.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class GraphEffects {
    constructor(
        private actions$: Actions,
        private store$: Store<GraphState>,
        private lndApiServiceService: LndApiServiceService,
    ) {
        this.store$
            .select(selectNodeSetValue)
            .subscribe((nsv) => console.log(nsv.filter((n) => !!n.parent).length));
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
                map((nodeSet: Record<string, LndNodeWithPosition>) =>
                    graphActions.cacheProcessedGraphNodeChunk({ nodeSet }),
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
                        // const parent = nodeRegistry[channel.policies[0].public_key];
                        // parent?.connectedChannels.enqueue(
                        //     {...channel, parent},
                        // );

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
                        // nodeRegistry[channel.policies[1].public_key]?.connectedChannels.enqueue(
                        //     {...channel, parent},
                        // );
                        //nodeRegistry[channel.policies[0].public_key].parent =
                        // console.log(
                        //     nodeRegistry[channel.policies[0].public_key]?.connectedChannels.front(),
                        // );
                    }),
                ),
                map(
                    ([, nodeRegistry]) =>
                        graphActions.cacheProcessedGraphNodeChunk({ nodeSet: nodeRegistry }),
                    //console.log(Object.values(nodeRegistry).filter((n) => !n.parent).length),
                ),
                // map((nodeSet: Record<string, LndNodeWithPosition>) =>
                //     graphActions.cacheProcessedGraphNodeChunk({ nodeSet }),
                // ),
            ),
        { dispatch: true },
    );
}
