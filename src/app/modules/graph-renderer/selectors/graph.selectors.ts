import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GraphState } from '../reducer/graph.reducer';

export const graphSelector = createFeatureSelector<GraphState>('graphState');

export const selectNodeChunksProcessed = createSelector(
    graphSelector,
    (state) => state.nodeChunksProcessed,
);

export const selectChannelChunksProcessed = createSelector(
    graphSelector,
    (state) => state.channelChunksProcessed,
);

export const selectChunkInfo = createSelector(graphSelector, (state) => state.chunkInfo);

export const isRequestInitiating = createSelector(
    graphSelector,
    (state) => state.isRequestInitiating,
);

export const selectChunkRemainingPercentage = createSelector(
    selectNodeChunksProcessed,
    selectChannelChunksProcessed,
    selectChunkInfo,
    (nodesProcessed, channelsProcessed, chunkInfo) => {
        if (!chunkInfo) return 0;
        const processed = 1 / nodesProcessed + channelsProcessed;
        const total = /*5.6 * chunkInfo.nodeChunks +*/ chunkInfo.edgeChunks;
        return (processed / total) * 100;
    },
);

export const selectLoadingText = createSelector(graphSelector, (state) => state.loadingText);

export const selectNodeCount = createSelector(graphSelector, (state) => state.nodeCount);
export const selectChannelCount = createSelector(graphSelector, (state) => state.channelCount);

export const selectNodeVertexBufferSize = createSelector(
    graphSelector,
    (state) => state.nodeVertexBufferSize,
);
export const selectNodeColorBufferSize = createSelector(
    graphSelector,
    (state) => state.nodeColorBufferSize,
);
export const selectNodeCapacityBufferSize = createSelector(
    graphSelector,
    (state) => state.nodeCapacityBufferSize,
);

export const selectChannelVertexBufferSize = createSelector(
    graphSelector,
    (state) => state.channelVertexBufferSize,
);
export const selectChannelColorBufferSize = createSelector(
    graphSelector,
    (state) => state.channelColorBufferSize,
);

export const selectChannelThicknessBufferSize = createSelector(
    graphSelector,
    (state) => state.channelThicknessBufferSize,
);
