import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { debounceTime } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalStatisticsCalculatorService } from 'src/app/graph-data/graph-statistics/services';
import * as graphActions from '../actions/graph.actions';
import { ChannelRegistryService } from '../services/channel-registry/channel-registry.service';
import { NodeRegistryService } from '../services/node-registry/node-registry.service';

@Injectable()
export class ChannelEffects {
    constructor(
        private actions$: Actions,
        private globalStatisticsCalculator: GlobalStatisticsCalculatorService,
        private nodeRegistry: NodeRegistryService,
        private channelRegistry: ChannelRegistryService,
    ) {}

    concatinateChannelChunk$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.processGraphChannelChunk),
                map((action) => {
                    action.chunk.data.forEach((channel) => {
                        // this.globalStatisticsCalculator.checkChannel(channel);
                        this.channelRegistry.set(channel.id, channel);
                    });
                    // this.globalStatisticsCalculator.updateStore();
                    return graphActions.cacheProcessedChannelChunk();
                }),
            ),
        { dispatch: true },
    );

    computeGlobalChannelStatistics$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.processGraphChannelChunk),
                debounceTime(250),
                map(() => {
                    this.channelRegistry.forEach((channel) => {
                        this.globalStatisticsCalculator.checkChannel(channel);
                    });
                    this.globalStatisticsCalculator.updateStore();
                    return graphActions.channelStatisticsDoneComputing();
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
                            if (node && !node.connected_channels.has(channel.id)) {
                                node.node_channel_count += 1;
                                node.node_capacity += channel.capacity;
                                node.connected_channels.set(channel.id, channel);
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

    // channelClosedEvent$ = createEffect(
    //     () =>
    //         this.actions$.pipe(
    //             ofType(graphActions.channelClosed),
    //             tap((action) => this.snackBar.open(`Channel ${action.channelId} has closed`)),
    //         ),
    //     { dispatch: true },
    // );
}
