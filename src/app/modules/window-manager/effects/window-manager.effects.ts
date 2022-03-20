import { Injectable, Optional } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
    animationFrames,
    filter,
    map,
    skip,
    switchMap,
    take,
    takeUntil,
    tap,
    throttleTime,
    timer,
} from 'rxjs';
import { FilterModalComponent } from '../../controls-graph-filter/components/filter-modal/filter-modal.component';
import * as graphActions from '../../graph-renderer/actions';
import { setModalClose } from '../actions';
import { filterScriptsId, quickControlsId } from '../constants/windowIds';
import { WindowManagerState } from '../reducers';
import {
    selectModalState,
    shouldCloseModal,
    shouldShowModal,
    windowManagementSelector,
} from '../selectors';

@Injectable()
export class WindowManagerEffects {
    constructor(
        public dialog: MatDialog,
        // @Optional() public dialogRef: MatDialogRef<FilterModalComponent>,
        private store$: Store<WindowManagerState>,
    ) {
        this.store$.select(windowManagementSelector).subscribe(console.log);
    }

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

    public test: MatDialogRef<FilterModalComponent>;

    filterScriptsModalOpen$ = createEffect(
        () =>
            this.store$.select(shouldShowModal(filterScriptsId)).pipe(
                filter((action) => action !== undefined),
                tap(() => {
                    this.test = this.dialog.open(FilterModalComponent, {
                        maxWidth: null,
                        panelClass: 'custom-pannel',
                        height: '90vh',
                        maxHeight: '90vh',
                    });
                    this.test
                        .beforeClosed()
                        .pipe(take(1))
                        .subscribe(() =>
                            this.store$.dispatch(setModalClose({ modalId: filterScriptsId })),
                        );
                }),
            ),
        { dispatch: false },
    );

    filterScriptsModalClose$ = createEffect(
        () =>
            this.store$.select(shouldCloseModal(filterScriptsId)).pipe(
                filter((action) => action !== undefined),
                tap(() => this.test?.close()),
            ),
        { dispatch: false },
    );
}
