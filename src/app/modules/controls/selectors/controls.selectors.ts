import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GenericControlsState } from '../reducers/controls.reducer';

export const controlsSelector = createFeatureSelector<GenericControlsState>('genericControls');

export const selectSearchString = createSelector(controlsSelector, (state) => state.searchText);

export const shouldRenderEdges = createSelector(controlsSelector, (state) => state.renderEdges);

export const shouldRenderLabels = createSelector(controlsSelector, (state) => state.renderLabels);

export const selectCameraFov = createSelector(controlsSelector, (state) => state.cameraFov);

export const selectCameraFocusMode = createSelector(
    controlsSelector,
    (state) => state.cameraFocusMode,
);

export const selectEdgeDepthTest = createSelector(controlsSelector, (state) => state.edgeDepthTest);

export const selectEdgeDottedLine = createSelector(
    controlsSelector,
    (state) => state.edgeDottedLine,
);

export const capacityFilterAmount = createSelector(
    controlsSelector,
    (state) => state.capacityFilterAmount,
);

export const capacityFilterEnable = createSelector(
    controlsSelector,
    (state) => state.capacityFilterEnable,
);
