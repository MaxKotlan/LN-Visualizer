import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WindowManagerState } from '../reducers';

export const windowManagementSelector =
    createFeatureSelector<WindowManagerState>('windowManagement');

export const selectModalState = (modalId: string) =>
    createSelector(windowManagementSelector, (state) => state.modalState[modalId]);

export const modalPreference = (modalId: string) =>
    createSelector(windowManagementSelector, (state) => state.modalPreference[modalId]);
