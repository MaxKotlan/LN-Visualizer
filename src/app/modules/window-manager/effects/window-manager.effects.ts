import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { animationFrames, map, switchMap, takeUntil, throttleTime, timer } from 'rxjs';
import * as graphActions from '../../graph-renderer/actions';
import { quickControlsId } from '../constants/windowIds';
import { WindowManagerState } from '../reducers';
import { selectModalState } from '../selectors';

@Injectable()
export class WindowManagerEffects {
    constructor(private store$: Store<WindowManagerState>) {}

    recomputeCanvasSize$ = createEffect(
        () =>
            this.store$
                .select(selectModalState(quickControlsId))
                .pipe(
                    switchMap(() =>
                        animationFrames().pipe(
                            takeUntil(timer(250)),
                            throttleTime(10),
                            map(graphActions.recomputeCanvasSize),
                        ),
                    ),
                ),
        { dispatch: true },
    );
}
