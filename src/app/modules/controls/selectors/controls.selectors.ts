import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GenericControlsState } from '../reducers/controls.reducer';

export const controlsSelector = createFeatureSelector<GenericControlsState>('genericControls');

export const selectSearchString = createSelector(controlsSelector, (state) => state.searchText);

export const shouldRenderLabels = createSelector(controlsSelector, (state) => state.renderLabels);

export const selectCameraFov = createSelector(controlsSelector, (state) => state.cameraFov);

export const selectCameraFocusMode = createSelector(
    controlsSelector,
    (state) => state.cameraFocusMode,
);
