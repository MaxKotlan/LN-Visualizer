import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NodeControlState } from '../reducer';

export const nodeControlsSelector = createFeatureSelector<NodeControlState>('nodeControls');
export const shouldRenderNodes = createSelector(nodeControlsSelector, (state) => state.renderNodes);

export const selectNodeSize = createSelector(nodeControlsSelector, (state) => state.nodeSize);

export const selectMinimumNodeSize = createSelector(
    nodeControlsSelector,
    (state) => state.minNodeSize,
);

export const selectPointAttenuation = createSelector(
    nodeControlsSelector,
    (state) => state.pointAttenuation,
);

export const selectPointUseIcon = createSelector(
    nodeControlsSelector,
    (state) => state.pointUseIcon,
);

export const selectUniformNodeSize = createSelector(
    nodeControlsSelector,
    (state) => state.uniformNodeSize,
);
