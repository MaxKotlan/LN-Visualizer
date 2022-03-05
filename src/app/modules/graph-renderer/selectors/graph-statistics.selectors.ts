import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GraphStatisticsState } from '../reducer/graph-statistics.reducer';
import { selectChannelCount } from './graph.selectors';

export const graphStatisticsSelector =
    createFeatureSelector<GraphStatisticsState>('graphStatisticsState');

export const selectChannelMinMaxTotal = createSelector(
    graphStatisticsSelector,
    (state) => state.channelCapacity,
);

export const selectTotalChannelCapacity = createSelector(
    selectChannelMinMaxTotal,
    (state) => state.total,
);

export const selectMaximumChannelCapacity = createSelector(
    selectChannelMinMaxTotal,
    (state) => state.max,
);

export const selectMinimumChannelCapacity = createSelector(
    selectChannelMinMaxTotal,
    (state) => state.min,
);

export const selectAverageCapacity = createSelector(
    selectTotalChannelCapacity,
    selectChannelCount,
    (totalCapacity, channelCount) => Math.floor(totalCapacity / channelCount) || 0,
);
