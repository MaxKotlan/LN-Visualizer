import { createReducer, on } from '@ngrx/store';
import * as graphStatisticActions from '../actions/graph-statistics.actions';
import { initialStatisticsState } from '../models';

export const reducer = createReducer(
    initialStatisticsState,
    on(graphStatisticActions.updateGlobalMinMaxStatistic, (state, { property, newStatState }) => ({
        ...state,
        [property]: newStatState,
    })),
);
