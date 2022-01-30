import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, tap } from 'rxjs';
import { GraphState } from '../reducers/graph.reducer';
import { selectFinalMatcheNodesFromSearch } from '../selectors/graph.selectors';
import { Location } from '@angular/common';

@Injectable()
export class RouteEffects {
    constructor(private store$: Store<GraphState>, private location: Location) {}

    finalNodeSelected$ = createEffect(
        () =>
            this.store$.select(selectFinalMatcheNodesFromSearch).pipe(
                filter((node) => !!node?.public_key),
                tap((node) => this.location.replaceState(node.public_key)),
            ),
        { dispatch: false },
    );

    nothingSelected$ = createEffect(
        () =>
            this.store$.select(selectFinalMatcheNodesFromSearch).pipe(
                filter((node) => !node?.public_key),
                tap(() => this.location.replaceState('')),
            ),
        { dispatch: false },
    );
}
