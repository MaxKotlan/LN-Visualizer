import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Chunk, LndChannel, LndNode } from 'api/src/models';
import { ChannelCloseEvent } from 'api/src/models/channel-close-event.interface';
import { ChunkInfo } from 'api/src/models/chunkInfo.interface';
import { from, of } from 'rxjs';
import { catchError, delay, filter, map, mergeMap } from 'rxjs/operators';
import { LndApiServiceService } from 'src/app/services/lnd-api-service.service';
import * as alertActions from '../../alerts/actions/alerts.actions';
import * as graphActions from '../actions/graph.actions';

@Injectable()
export class NetworkEffects {
    constructor(private actions$: Actions, private lndApiServiceService: LndApiServiceService) {}

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
                                case 'channel-updated':
                                    return graphActions.channelUpdated({
                                        channelId: (data as unknown as ChannelCloseEvent).data,
                                    });
                            }
                            return graphActions.errorUnknownChunkDataType();
                        }),
                        mergeMap((wow) =>
                            from([
                                wow,
                                alertActions.dismissAlert({ id: 'websocket-connection-error' }),
                            ]),
                        ),
                        catchError((e: ErrorEvent) => {
                            return of(
                                alertActions.createAlert({
                                    alert: {
                                        id: 'websocket-connection-error',
                                        type: 'danger',
                                        message: `Could not connect to websocket at ${
                                            (e.target as unknown as any).url
                                        }. The server might be down`,
                                    },
                                }),
                            );
                        }),
                    ),
                ),
            ),
        { dispatch: true },
    );

    public retryOnError$ = createEffect(() =>
        this.actions$.pipe(
            ofType(alertActions.createAlert),
            filter((action) => action.alert.id === 'websocket-connection-error'),
            delay(1000),
            map(() => graphActions.initializeGraphSyncProcess()),
        ),
    );
}
