import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DevModeState } from '../reducer/dev-mode.reducer';

export const devModeStateSelector = createFeatureSelector<DevModeState>('devMode');

export const selectDevModeEnabled = createSelector(
    devModeStateSelector,
    (state) => state.devModeEnabled,
);
