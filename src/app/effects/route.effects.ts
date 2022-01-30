import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, tap, withLatestFrom } from 'rxjs';
import { GraphState } from '../reducers/graph.reducer';
import { selectFinalMatcheNodesFromSearch } from '../selectors/graph.selectors';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as controlsActions from '../actions/controls.actions';

@Injectable()
export class RouteEffects {
    constructor(
        private store$: Store<GraphState>,
        private location: Location,
        private router: ActivatedRoute,
    ) {}

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

    routerChange$ = createEffect(
        () =>
            this.router.params.pipe(
                map((params) => params['public_key']),
                withLatestFrom(this.store$.select(selectFinalMatcheNodesFromSearch)),
                filter(
                    ([routePubKey, currentSelected]) => currentSelected?.public_key !== routePubKey,
                ),
                map(([routePubKey, currentSelected]) =>
                    controlsActions.searchGraph({ searchText: routePubKey }),
                ),
            ),
        { dispatch: true },
    );
}
