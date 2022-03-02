import { createFeatureSelector, createSelector } from '@ngrx/store';
let colormap = require('colormap');
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

export const channelColor = createSelector(channelControlsSelector, (state) => state.channelColor);

export const channelColorMap = createSelector(
    channelControlsSelector,
    (state) => state.channelColorMap,
);

export const channelColorMapRgb = createSelector(channelColorMap, (color) => {
    const hexarr = colormap({
        colormap: color,
        nshades: 500,
        format: 'hex',
        alpha: 1,
    });
    return hexarr.map(fromHexString);
});

const fromHexString = (hexString: string) => [
    parseInt(hexString[1] + hexString[2], 16),
    parseInt(hexString[3] + hexString[4], 16),
    parseInt(hexString[5] + hexString[6], 16),
];
