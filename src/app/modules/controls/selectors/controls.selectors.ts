import { createFeatureSelector, createSelector } from '@ngrx/store';
import { channelControlsSelector } from '../../controls-channel/selectors';
import { miscControlsSelector } from '../../controls-misc/selectors/misc-controls.selectors';
import { nodeControlsSelector } from '../../controls-node/selectors/node-controls.selectors';
import { renderControlsSelector } from '../../controls-renderer/selectors';
import { GenericControlsState } from '../reducers/controls.reducer';
import { ControlsState } from '../types';

export const genericControlsSelector =
    createFeatureSelector<GenericControlsState>('genericControls');

export const controlsSelector = createSelector(
    genericControlsSelector,
    nodeControlsSelector,
    channelControlsSelector,
    renderControlsSelector,
    miscControlsSelector,
    (genericControls, nodeControls, channelControls, renderControls, miscControls) =>
        ({
            genericControls,
            nodeControls,
            channelControls,
            renderControls,
            miscControls,
        } as ControlsState),
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
