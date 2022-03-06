import { createReducer, on } from '@ngrx/store';
import { initMinMaxTotal, MinMaxTotal } from 'src/app/types/min-max-total.interface';

import * as graphStatisticActions from '../actions/graph-statistics.actions';

export interface GraphStatisticsState {
    channelCapacity: MinMaxTotal;
    channelFees: MinMaxTotal;
}

const initialState: GraphStatisticsState = {
    channelCapacity: initMinMaxTotal,
    channelFees: initMinMaxTotal,
};

export const reducer = createReducer(
    initialState,
    on(graphStatisticActions.setChannelCapacityMinMax, (state, { channelCap }) => ({
        ...state,
        channelCapacity: channelCap,
    })),
    on(graphStatisticActions.setChannelFeesMinMax, (state, { channelFees }) => ({
        ...state,
        channelFees,
    })),
);
