import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LndChannel, LndNode } from 'api/src/models';
import { ChunkInfo } from 'api/src/models/chunkInfo.interface';
import { LndNodeWithPosition } from 'api/src/models/node-position.interface';
import { catchError, filter, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import * as graphActions from '../actions/graph.actions';
import { LndApiServiceService } from '../services/lnd-api-service.service';
import { Chunk } from '../types/chunk.interface';
import { createSpherePoint } from '../utils';
import * as THREE from 'three';
import { MaxPriorityQueue } from '@datastructures-js/priority-queue';
import { selectNodeSetKeyValue } from '../selectors/graph.selectors';
import { GraphState } from '../reducers/graph.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class GraphEffects {
    constructor(
        private actions$: Actions,
        private store$: Store<GraphState>,
        private lndApiServiceService: LndApiServiceService,
    ) {}

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

    private readonly nodeQueueComparitor = {
        compare: (a: LndChannel, b: LndChannel): number => {
            return a.capacity - b.capacity;
        },
    };

    positionNodes$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.processGraphNodeChunk),
                map((action) =>
                    action.chunk.data.reduce((acc, node) => {
                        acc[node.public_key] = {
                            ...node,
                            position: createSpherePoint(1, this.origin, node.public_key),
                            connectedChannels: new MaxPriorityQueue<LndChannel>(
                                this.nodeQueueComparitor,
                            ),
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

    positionChannels$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.processGraphChannelChunk),
                withLatestFrom(this.store$.select(selectNodeSetKeyValue)),
                tap(([action, nodeRegistry]) =>
                    action.chunk.data.forEach((channel: LndChannel) => {
                        nodeRegistry[channel.policies[0].public_key]?.connectedChannels.enqueue(
                            channel,
                        );
                        nodeRegistry[channel.policies[1].public_key]?.connectedChannels.enqueue(
                            channel,
                        );
                    }),
                ),
                //tap(([action, nodeRegistry]) => console.log(nodeRegistry)),
                // map((nodeSet: Record<string, LndNodeWithPosition>) =>
                //     graphActions.cacheProcessedGraphNodeChunk({ nodeSet }),
                // ),
            ),
        { dispatch: false },
    );
}
