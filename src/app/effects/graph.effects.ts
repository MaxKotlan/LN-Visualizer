import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, of, tap } from 'rxjs';
import * as graphActions from '../actions/graph.actions';
import { LndApiServiceService } from '../services/lnd-api-service.service';

@Injectable()
export class GraphEffects {
    constructor(private actions$: Actions, private lndApiServiceService: LndApiServiceService) {}

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

    onNodeChunk$ = createEffect(() =>
        this.lndApiServiceService.initialChunkSync().pipe(
            filter((chunk) => chunk.type === 'node'),
            tap((c) => console.log(c)),
            map((chunk) => graphActions.processGraphNodeChunk({ chunk })),
        ),
    );

    onChannelChunk$ = createEffect(() =>
        this.lndApiServiceService.initialChunkSync().pipe(
            filter((chunk) => chunk.type === 'channel'),
            tap((c) => console.log(c)),
            map((chunk) => graphActions.processGraphNodeChunk({ chunk })),
        ),
    );
}
