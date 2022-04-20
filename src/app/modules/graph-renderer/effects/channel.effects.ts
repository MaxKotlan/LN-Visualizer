import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import * as graphActions from '../actions/graph.actions';
import { ChannelRegistryService } from '../services/channel-registry/channel-registry.service';
import { GraphDatabaseService } from '../services/graph-database/graph-database.service';
import { MinMaxCalculatorService } from '../services/min-max-calculator/min-max-calculator.service';
import { NodeRegistryService } from '../services/node-registry/node-registry.service';

@Injectable()
export class ChannelEffects {
    constructor(
        private actions$: Actions,
        private minMaxCaluclator: MinMaxCalculatorService,
        private nodeRegistry: NodeRegistryService,
        private channelRegistry: ChannelRegistryService,
        private graphDatabaseService: GraphDatabaseService,
    ) {}

    concatinateChannelChunk$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.processGraphChannelChunk),
                map((action) => {
                    action.chunk.data.forEach((channel) => {
                        this.minMaxCaluclator.checkChannel(channel);
                        this.channelRegistry.set(channel.id, channel);
                    });
                    this.minMaxCaluclator.updateStore();
                    return graphActions.cacheProcessedChannelChunk();
                }),
            ),
        { dispatch: true },
    );

    recalculatePosition$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.cacheProcessedChannelChunk),
                map(() => {
                    this.channelRegistry.forEach((channel) => {
                        channel.policies.forEach((policy) => {
                            const node = this.nodeRegistry.get(policy.public_key);
                            if (node && !node.connectedChannels.has(channel.id)) {
                                node.channel_count += 1;
                                node.node_capacity += channel.capacity;
                                node.connectedChannels.set(channel.id, channel);
                            }
                        });
                    });
                    return graphActions.graphNodePositionRecalculate();
                }),
            ),
        { dispatch: true },
    );

    recomputestuff$ = createEffect(() =>
        this.actions$.pipe(
            ofType(graphActions.graphNodePositionRecalculate),
            map((d) => graphActions.cacheProcessedGraphNodeChunk()),
        ),
    );

    saveToDatabase$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.initSyncRequestComplete),
                tap(() => this.graphDatabaseService.save()),
            ),
        { dispatch: false },
    );

    saveChunkToDatabase$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.processChunkInfo),
                tap((processChunkInfo) =>
                    this.graphDatabaseService.saveChunkInfo(processChunkInfo.chunkInfo),
                ),
            ),
        { dispatch: false },
    );

    loadFromDb$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.loadGraphFromStorage),
                mergeMap(() =>
                    from(this.graphDatabaseService.load()).pipe(
                        map(() => graphActions.graphNodePositionRecalculate()),
                    ),
                ),
            ),
        { dispatch: true },
    );

    // channelClosedEvent$ = createEffect(
    //     () =>
    //         this.actions$.pipe(
    //             ofType(graphActions.channelClosed),
    //             tap((action) => this.snackBar.open(`Channel ${action.channelId} has closed`)),
    //         ),
    //     { dispatch: true },
    // );
}
