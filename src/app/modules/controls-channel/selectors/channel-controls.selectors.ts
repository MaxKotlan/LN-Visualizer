import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChannelControlState } from '../reducers';

export const channelControlsSelector =
    createFeatureSelector<ChannelControlState>('channelControls');

export const shouldRenderEdges = createSelector(
    channelControlsSelector,
    (state) => state.renderEdges,
);

export const selectEdgeDepthTest = createSelector(
    channelControlsSelector,
    (state) => state.edgeDepthTest,
);
export const selectEdgeDottedLine = createSelector(
    channelControlsSelector,
    (state) => state.edgeDottedLine,
);

export const capacityFilterAmount = createSelector(
    channelControlsSelector,
    (state) => state.capacityFilterAmount,
);

export const capacityFilterEnable = createSelector(
    channelControlsSelector,
    (state) => state.capacityFilterEnable,
);
