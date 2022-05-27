import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
    animationFrames,
    distinctUntilChanged,
    filter,
    map,
    switchMap,
    takeUntil,
    takeWhile,
    throttleTime,
    timer,
} from 'rxjs';
import { FilterModalComponent } from '../../controls-graph-filter/components/filter-modal/filter-modal.component';
import * as graphActions from '../../graph-renderer/actions';
import { ScreenSizeService } from '../../screen-size/services';
import * as windowManagementActions from '../actions';
import { quickControlsId } from '../constants/windowIds';
import { WindowManagerState } from '../reducers';
import { isBeingDragged, selectAllModalState } from '../selectors';

@Injectable()
export class WindowManagerEffects {
    constructor(
        public dialog: MatDialog,
        private store$: Store<WindowManagerState>,
        public screenSizeService: ScreenSizeService,
    ) {}

    modalStateChanged$ = createEffect(
        () =>
            this.store$
                .select(selectAllModalState)
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

    windowIsBeingDragged$ = createEffect(() =>
        this.store$.select(isBeingDragged).pipe(
            switchMap((isBeingDragged) =>
                animationFrames().pipe(
                    filter(() => isBeingDragged),
                    throttleTime(10),
                    map(graphActions.recomputeCanvasSize),
                ),
            ),
        ),
    );

    // mobileModal$ = createEffect(
    //     () =>
    //         this.screenSizeService.isMobile$.pipe(
    //             map((isMobile) => {
    //                 if (isMobile) {
    //                     return setModalPreference({
    //                         modalId: filterScriptsId,
    //                         preference: 'modal',
    //                     });
    //                 } else {
    //                     return setModalPreference({
    //                         modalId: filterScriptsId,
    //                         preference: 'sidebar',
    //                     });
    //                 }
    //             }),
    //         ),
    //     { dispatch: true },
    // );

    $openOnSwitch = createEffect(() =>
        this.screenSizeService.isDesktop$.pipe(
            distinctUntilChanged(),
            filter((x) => x),
            map(() => windowManagementActions.setModalOpen({ modalId: quickControlsId })),
        ),
    );

    $closeOnSwitch = createEffect(() =>
        this.screenSizeService.isMobile$.pipe(
            distinctUntilChanged(),
            filter((x) => x),
            map(() => windowManagementActions.setModalClose({ modalId: quickControlsId })),
        ),
    );

    public openedModal: MatDialogRef<FilterModalComponent>;

    // filterModalClose$ = createEffect(
    //     () =>
    //         combineLatest([
    //             this.store$.select(selectModalState(filterScriptsId)),
    //             this.store$.select(selectModalPreference(filterScriptsId)),
    //             this.openedModal.beforeClosed(),
    //         ]).pipe(
    //             filter(
    //                 ([modalState, modalPreference]) =>
    //                     modalState === 'open' && modalPreference === 'modal' && !this.openedModal,
    //             ),
    //         ),
    //     { dispatch: false },
    // );

    // filterScriptsModalOpen$ = createEffect(
    //     () =>
    //         combineLatest([
    //             this.store$.select(selectModalState(filterScriptsId)),
    //             this.store$.select(selectModalPreference(filterScriptsId)),
    //         ]).pipe(
    //             filter(
    //                 ([modalState, modalPreference]) =>
    //                     modalState === 'close' && modalPreference === 'modal' && !this.openedModal,
    //             ),
    //             tap(() => {
    //                 this.openedModal = this.dialog.open(FilterModalComponent, {
    //                     maxWidth: null,
    //                     panelClass: 'custom-pannel',
    //                     height: '90vh',
    //                     maxHeight: '90vh',
    //                 });
    //                 this.openedModal.afterClosed().subscribe(() => {
    //                     this.openedModal = undefined;
    //                     this.store$.dispatch(setModalClose({ modalId: filterScriptsId }));
    //                 });
    //             }),
    //         ),
    //     { dispatch: false },
    // );

    // // filterScriptsModalOpen$ = createEffect(
    // //     () =>
    // //         this.store$.select(shouldShowModal(filterScriptsId)).pipe(
    // //             filter((action) => action === true && !this.test),
    // //             tap(() => {
    // //                 this.test = this.dialog.open(FilterModalComponent, {
    // //                     maxWidth: null,
    // //                     panelClass: 'custom-pannel',
    // //                     height: '90vh',
    // //                     maxHeight: '90vh',
    // //                 });
    // //                 this.test
    // //                     .afterClosed()
    // //                     .pipe(take(1))
    // //                     .subscribe(() => {
    // //                         this.store$.dispatch(setModalClose({ modalId: filterScriptsId }));
    // //                     });
    // //             }),
    // //         ),
    // //     { dispatch: false },
    // // );

    // filterScriptsModalClose$ = createEffect(
    //     () =>
    //         this.store$.select(selectModalState(filterScriptsId)).pipe(
    //             filter((modalState) => modalState === 'open' && !!this.openedModal),
    //             tap(() => this.openedModal.close()),
    //         ),
    //     { dispatch: false },
    // );
}
