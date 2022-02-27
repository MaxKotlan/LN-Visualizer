import { createFeatureSelector, createSelector } from '@ngrx/store';
import { channelControlsSelector } from '../../controls-channel/selectors';
import { nodeControlsSelector } from '../../controls-node/selectors/node-controls.selectors';
import { GenericControlsState } from '../reducers/controls.reducer';

export const genericControlsSelector =
    createFeatureSelector<GenericControlsState>('genericControls');

export const controlsSelector = createSelector(
    genericControlsSelector,
    nodeControlsSelector,
    channelControlsSelector,
    (generic, node, channel) => ({ ...generic, ...node, ...channel }),
);

export const selectSearchString = createSelector(
    genericControlsSelector,
    (state) => state.searchText,
);

export const shouldRenderLabels = createSelector(
    genericControlsSelector,
    (state) => state.renderLabels,
);

export const selectCameraFov = createSelector(genericControlsSelector, (state) => state.cameraFov);

export const selectCameraFocusMode = createSelector(
    genericControlsSelector,
    (state) => state.cameraFocusMode,
);
