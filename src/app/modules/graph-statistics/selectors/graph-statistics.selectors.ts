import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectChannelCount } from '../../graph-renderer/selectors/graph.selectors';
import { GraphStatisticsState } from '../models';

export const globalStatisticsSelector =
    createFeatureSelector<GraphStatisticsState>('globalStatistics');

export const filteredStatisticsSelector =
    createFeatureSelector<GraphStatisticsState>('filteredStatistics');

export const selectChannelMinMaxTotal = createSelector(
    globalStatisticsSelector,
    (state) => state.capacity,
);

export const selectChannelFeesMinMaxTotal = createSelector(
    globalStatisticsSelector,
    (state) => state.fee_rate,
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
    (node_capacity, channelCount) => Math.floor(node_capacity / channelCount) || 0,
);

export const selectMinMax = (property: keyof GraphStatisticsState) =>
    createSelector(globalStatisticsSelector, (graphState) => graphState[property]);

export const statsLabels = createSelector(globalStatisticsSelector, (state) =>
    Object.keys(state).flatMap((key) =>
        Object.keys(state[key]).map(
            (key2) => `${state[key][key2] === Infinity ? 0 : state[key][key2]} ${key2} ${key}\n`,
        ),
    ),
);

export const filteredStatsLabels = createSelector(filteredStatisticsSelector, (state) =>
    Object.keys(state).flatMap((key) =>
        Object.keys(state[key]).map(
            (key2) => `${state[key][key2] === Infinity ? 0 : state[key][key2]} ${key2} ${key}\n`,
        ),
    ),
);
