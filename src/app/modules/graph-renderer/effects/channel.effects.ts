import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, throttleTime, withLatestFrom } from 'rxjs/operators';
import * as graphActions from '../actions/graph.actions';
import { GraphState } from '../reducer';
import { selectChannelSetKeyValue } from '../selectors';
import { MinMaxCalculatorService } from '../services/min-max-calculator/min-max-calculator.service';

@Injectable()
export class ChannelEffects {
    constructor(
        private actions$: Actions,
        private store$: Store<GraphState>,
        private minMaxCaluclator: MinMaxCalculatorService,
    ) {}

    concatinateChannelChunk$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.processGraphChannelChunk),
                withLatestFrom(this.store$.select(selectChannelSetKeyValue)),
                map(([action, channelState]) => {
                    action.chunk.data.forEach((channel) => {
                        this.minMaxCaluclator.checkChannel(channel);
                        channelState.set(channel.id, channel);
                    });
                    this.minMaxCaluclator.updateStore();
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
                withLatestFrom(
                    this.actions$.pipe(ofType(graphActions.cacheProcessedGraphNodeChunk)),
                ),
                map(([channels, nodeRegistry]) => {
                    channels.channelSet.forEach((channel) => {
                        channel.policies.forEach((policy) => {
                            const node = nodeRegistry.nodeSet.get(policy.public_key);
                            if (node) {
                                node.connectedChannels.set(channel.id, channel);
                            }
                        });
                    });

                    return graphActions.graphNodePositionRecalculate({
                        nodeSet: nodeRegistry.nodeSet,
                    });
                }),
            ),
        { dispatch: true },
    );

    recomputestuff$ = createEffect(() =>
        this.actions$.pipe(
            ofType(graphActions.graphNodePositionRecalculate),
            map((d) => graphActions.cacheProcessedGraphNodeChunk({ nodeSet: d.nodeSet })),
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
