import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectColorRangeMinMax } from 'src/app/ui/settings/controls-channel/selectors';
import { GraphStatisticsState } from '../models';

export const globalStatisticsSelector =
    createFeatureSelector<GraphStatisticsState>('globalStatistics');

export const filteredStatisticsSelector =
    createFeatureSelector<GraphStatisticsState>('filteredStatistics');

export const selectChannelFeesMinMaxTotal = createSelector(
    globalStatisticsSelector,
    (state) => state.fee_rate,
);

export const selectMinMax = (property: keyof GraphStatisticsState) =>
    createSelector(globalStatisticsSelector, (graphState) => graphState[property]);

export const selectMinMaxFiltered = (property: keyof GraphStatisticsState) =>
    createSelector(
        globalStatisticsSelector,
        filteredStatisticsSelector,
        selectColorRangeMinMax,
        (globalStats, filteredStats, type) =>
            type === 'global' ? globalStats[property] : filteredStats[property],
    );

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
