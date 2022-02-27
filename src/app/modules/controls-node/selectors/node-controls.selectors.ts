import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NodeControlState } from '../reducer';

export const controlsSelector = createFeatureSelector<NodeControlState>('nodeControls');
export const shouldRenderNodes = createSelector(controlsSelector, (state) => state.renderNodes);

export const selectNodeSize = createSelector(controlsSelector, (state) => state.nodeSize);

export const selectMinimumNodeSize = createSelector(controlsSelector, (state) => state.minNodeSize);

export const selectPointAttenuation = createSelector(
    controlsSelector,
    (state) => state.pointAttenuation,
);

export const selectPointUseIcon = createSelector(controlsSelector, (state) => state.pointUseIcon);

export const selectUniformNodeSize = createSelector(
    controlsSelector,
    (state) => state.uniformNodeSize,
);
