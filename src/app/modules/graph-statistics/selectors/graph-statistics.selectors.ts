import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GraphStatisticsState } from '../reducer/graph-statistics.reducer';
import { selectChannelCount } from '../../graph-renderer/selectors/graph.selectors';

export const graphStatisticsSelector =
    createFeatureSelector<GraphStatisticsState>('graphStatisticsState');

export const selectChannelMinMaxTotal = createSelector(
    graphStatisticsSelector,
    (state) => state.capacity,
);

export const selectChannelFeesMinMaxTotal = createSelector(
    graphStatisticsSelector,
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
    createSelector(graphStatisticsSelector, (graphState) => graphState[property]);

export const statsLabels = createSelector(graphStatisticsSelector, (state) =>
    Object.keys(state).flatMap((key) =>
        Object.keys(state[key]).map(
            (key2) => `${state[key][key2] === Infinity ? 0 : state[key][key2]} ${key2} ${key}\n`,
        ),
    ),
);
