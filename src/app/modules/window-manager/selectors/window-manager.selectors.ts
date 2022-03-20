import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WindowManagerState } from '../reducers';

export const windowManagementSelector =
    createFeatureSelector<WindowManagerState>('windowManagement');

export const selectAllModalState = createSelector(
    windowManagementSelector,
    (state) => state.modalState,
);

export const selectModalState = (modalId: string) =>
    createSelector(windowManagementSelector, (state) => state.modalState[modalId]);

export const selectModalStateBool = (modalId: string) =>
    createSelector(windowManagementSelector, (state) => state.modalState[modalId] === 'open');

export const selectModalPreference = (modalId: string) =>
    createSelector(windowManagementSelector, (state) => state.modalPreference[modalId]);

export const shouldShowSidebar = (modalId: string) =>
    createSelector(
        windowManagementSelector,
        (state) =>
            state.modalPreference[modalId] === 'sidebar' && state.modalState[modalId] === 'open',
    );

// export const shouldShowModal = (modalId: string) =>
//     createSelector(
//         windowManagementSelector,
//         (state) =>
//             state.modalPreference[modalId] === 'modal' && state.modalState[modalId] === 'open',
//     );

// export const shouldCloseModal = (modalId: string) =>
//     createSelector(
//         windowManagementSelector,
//         (state) =>
//             state.modalPreference[modalId] === 'modal' && state.modalState[modalId] === 'close',
//     );
