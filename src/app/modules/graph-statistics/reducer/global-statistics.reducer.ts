import { createReducer, on } from '@ngrx/store';
import { initMinMax, initMinMaxTotal } from 'src/app/types/min-max-total.interface';

import * as graphStatisticActions from '../actions/graph-statistics.actions';
import { GraphStatisticsState } from '../models';

const initialState: GraphStatisticsState = {
    channel_count: initMinMax,
    node_capacity: initMinMax,
    capacity: initMinMaxTotal,
    base_fee_mtokens: initMinMax,
    cltv_delta: initMinMax,
    fee_rate: initMinMax,
    max_htlc_mtokens: initMinMax,
    min_htlc_mtokens: initMinMax,
};

export const reducer = createReducer(
    initialState,
    on(graphStatisticActions.updateGlobalMinMaxStatistic, (state, { property, newStatState }) => ({
        ...state,
        [property]: newStatState,
    })),
);
