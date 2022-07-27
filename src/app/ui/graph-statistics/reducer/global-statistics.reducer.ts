import { createReducer, on } from '@ngrx/store';
import * as globalStatisticActions from '../actions/global-statistics.actions';
import { initialStatisticsState } from '../models';

export const reducer = createReducer(
    initialStatisticsState,
    on(globalStatisticActions.updateGlobalMinMaxStatistic, (state, { property, newStatState }) => ({
        ...state,
        [property]: newStatState,
    })),
    on(globalStatisticActions.updateAllGlobalMinMaxStatistic, (state, { newState }) => ({
        ...newState,
    })),
);
