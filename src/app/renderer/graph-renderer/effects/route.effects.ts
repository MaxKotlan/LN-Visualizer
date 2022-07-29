import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, skip, tap, withLatestFrom } from 'rxjs';
import * as controlsActions from '../ui/controls/actions';
import { GraphState } from '../ui/src/app/renderer/graph-renderer/reducer';
import { selectFinalMatcheNodesFromSearch } from '../ui/src/app/renderer/graph-renderer/selectors';

@Injectable()
export class RouteEffects {
    constructor(private store$: Store<GraphState>, private router: Router) {}

    finalNodeSelected$ = createEffect(
        () =>
            this.store$.select(selectFinalMatcheNodesFromSearch).pipe(
                skip(1),
                filter((node) => !!node?.public_key),
                tap((node) => this.router.navigate([node.public_key])),
            ),
        { dispatch: false },
    );

    nothingSelected$ = createEffect(
        () =>
            this.store$.select(selectFinalMatcheNodesFromSearch).pipe(
                skip(1),
                filter((node) => !node?.public_key),
                tap(() => this.router.navigate(['/'])),
            ),
        { dispatch: false },
    );

    routerChange$ = createEffect(
        () =>
            this.router.events.pipe(
                filter((e) => e instanceof NavigationEnd),
                map(
                    () =>
                        this.router.routerState.snapshot.root?.firstChild?.params['public_key'] ||
                        '',
                ),
                withLatestFrom(this.store$.select(selectFinalMatcheNodesFromSearch)),
                map(([routePubKey]) => controlsActions.searchGraph({ searchText: routePubKey })),
            ),
        { dispatch: true },
    );
}
