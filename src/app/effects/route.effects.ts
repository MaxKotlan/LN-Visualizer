import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs';
import { GraphState } from '../reducers/graph.reducer';
import { selectFinalMatcheNodesFromSearch } from '../selectors/graph.selectors';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import * as controlsActions from '../actions/controls.actions';

@Injectable()
export class RouteEffects {
    constructor(
        private store$: Store<GraphState>,
        private location: Location,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {}

    finalNodeSelected$ = createEffect(
        () =>
            this.store$.select(selectFinalMatcheNodesFromSearch).pipe(
                filter((node) => !!node?.public_key),
                //tap((node) => this.location.replaceState(node.public_key)),
                tap((node) => this.router.navigate([node.public_key])),
                // this.router
            ),
        { dispatch: false },
    );

    nothingSelected$ = createEffect(
        () =>
            this.store$.select(selectFinalMatcheNodesFromSearch).pipe(
                filter((node) => !node?.public_key),
                //tap(() => this.location.replaceState('')),
                tap(() => this.router.navigate(['/'])),
            ),
        { dispatch: false },
    );

    routerChange$ = createEffect(
        () =>
            this.router.events.pipe(
                filter((e) => e instanceof NavigationEnd),
                map(() => this.router.routerState.snapshot.root?.firstChild?.params['public_key']),
                filter((a) => !!a),
                withLatestFrom(this.store$.select(selectFinalMatcheNodesFromSearch)),
                filter(
                    ([routePubKey, currentSelected]) => currentSelected?.public_key !== routePubKey,
                ),
                map(([routePubKey]) => controlsActions.searchGraph({ searchText: routePubKey })),
            ),
        { dispatch: true },
    );
}
