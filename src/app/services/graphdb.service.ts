import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import Dexie from 'dexie';
import { cacheProcessedGraphNodeChunk } from '../modules/graph-renderer/actions';

@Injectable({
    providedIn: 'root',
})
export class GraphDBService extends Dexie {
    constructor(private actions$: Actions) {
        super('GraphDatabase');
        this.version(1).stores({
            graph: '',
        });

        this.actions$.pipe(ofType(cacheProcessedGraphNodeChunk)).subscribe(console.log);
    }
}
