import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
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

    onGraphChunk$ = createEffect(() =>
        this.lndApiServiceService
            .initialChunkSync()
            .pipe(map((chunk) => graphActions.processGraphNodeChunk({ chunk }))),
    );
}
