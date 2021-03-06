import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, mergeMap, tap } from 'rxjs';
import * as graphActions from 'src/app/graph-data/graph-process-data/actions';
import * as graphDatabaseActions from '../actions/graph-database.actions';
import { GraphDatabaseService } from '../services/graph-database/graph-database.service';

@Injectable()
export class GraphDatabaseEffects {
    constructor(private actions$: Actions, private graphDatabaseService: GraphDatabaseService) {}

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
                ofType(graphDatabaseActions.loadGraphFromStorage),
                mergeMap(() => from(this.graphDatabaseService.load())),
            ),
        { dispatch: false },
    );

    deleteDatabase$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(graphDatabaseActions.deleteGraphDatabase),
                tap(() => this.graphDatabaseService.deleteDatabase()),
            ),
        { dispatch: false },
    );
}
