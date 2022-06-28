import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Chunk, LndChannel, LndNode } from 'api/src/models';
import { ChannelCloseEvent } from 'api/src/models/channel-close-event.interface';
import { ChunkInfo } from 'api/src/models/chunkInfo.interface';
import { from, of } from 'rxjs';
import { catchError, delay, filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import * as alertActions from '../../alerts/actions/alerts.actions';
import * as graphActions from '../../graph-renderer/actions/graph.actions';
import { InitialSyncApiService } from '../services';
import * as graphSelectors from '../../graph-renderer/selectors';

@Injectable()
export class NetworkEffects {
    constructor(
        private actions$: Actions,
        private initialSyncApiService: InitialSyncApiService,
        private store: Store,
    ) {}

    retrieveGraph$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphActions.initializeGraphSyncProcess),
                tap(() => this.initialSyncApiService.sendSyncCommand()),
                mergeMap(() =>
                    this.initialSyncApiService.listenToStream().pipe(
                        filter((x) => !((x as unknown) instanceof String)), //commands sent as string so filter out (this will be refactored later)
                        filter((x) => !!x?.type),
                        map((data) => {
                            switch (data.type) {
                                case 'serverStatus':
                                    if ((data as any).status === 'ready to download')
                                        return alertActions.dismissAlert({ id: 'serverStatus' });
                                    else
                                        return alertActions.createAlert({
                                            alert: {
                                                id: 'serverStatus',
                                                type: 'info',
                                                message: `Please wait while the server is ${
                                                    (data as any).status
                                                }.`,
                                            },
                                        });
                                case 'requestComplete':
                                    this.initialSyncApiService.completeRequest();
                                    return graphActions.initSyncRequestComplete();
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
                            console.log(e);
                            return of(
                                alertActions.createAlert({
                                    alert: {
                                        id: 'websocket-connection-error',
                                        type: 'danger',
                                        message: `Could not connect to websocket at ${
                                            (e.target as unknown as any)?.url
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
            withLatestFrom(this.store.select(graphSelectors.selectIsRequestComplete)),
            filter(([, x]) => !x),
            delay(1000),
            map(() => graphActions.initializeGraphSyncProcess()),
        ),
    );
}
