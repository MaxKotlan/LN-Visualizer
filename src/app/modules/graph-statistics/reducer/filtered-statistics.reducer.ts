import { createReducer, on } from '@ngrx/store';
import * as filteredStatisticActions from '../actions/filtered-statistics.actions';
import { initialStatisticsState } from '../models';

export const reducer = createReducer(
    initialStatisticsState,
    on(
        filteredStatisticActions.updateFilteredMinMaxStatistic,
        (state, { property, newStatState }) => ({
            ...state,
            [property]: newStatState,
        }),
    ),
    on(filteredStatisticActions.clearFilteredMinMaxStatistic, () => initialStatisticsState),
);
