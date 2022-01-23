import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ControlsState } from '../reducers/controls.reducer';

export const controlsSelector = createFeatureSelector<ControlsState>('controlsState');

export const selectSearchString = createSelector(controlsSelector, (state) => state.searchText);

export const shouldRenderNodes = createSelector(controlsSelector, (state) => state.renderNodes);

export const shouldRenderEdges = createSelector(controlsSelector, (state) => state.renderEdges);

export const shouldRenderLabels = createSelector(controlsSelector, (state) => state.renderLabels);

export const selectNodeSize = createSelector(controlsSelector, (state) => state.nodeSize);

export const selectPointAttenuation = createSelector(
    controlsSelector,
    (state) => state.pointAttenuation,
);

export const selectPointUseIcon = createSelector(controlsSelector, (state) => state.pointUseIcon);

export const selectCameraFov = createSelector(controlsSelector, (state) => state.cameraFov);

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
