import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, skipUntil, take, tap } from 'rxjs';
import { ControlsState } from '../reducers/controls.reducer';
import { controlsSelector } from '../selectors/controls.selectors';
import * as controlActions from '../actions/controls.actions';

@Injectable()
export class ControlsEffects {
    constructor(
        private actions$: Actions, 
        private store$ : Store<ControlsState>
    ) {}

    saveControlsState$ = createEffect(() => 
        this.store$.select(controlsSelector).pipe(
        skipUntil(this.actions$.pipe(ofType(controlActions.loadSavedState), take(1))),
        tap((controlState) => {
            localStorage.setItem('controlState', JSON.stringify(controlState))
        }))
    , {dispatch: false});

    loadSavedState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(controlActions.loadSavedState),
            map(() => localStorage.getItem('controlState')),
            filter((controlStateStr) => !!controlStateStr),
            map((controlStateStr) => JSON.parse(controlStateStr || '')),
            map((savedState) => controlActions.setSavedStateFromLocalStorage({
                savedState
            }))
        )
    );

}