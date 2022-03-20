import { createReducer, on } from '@ngrx/store';
import {
    initMinMax,
    initMinMaxTotal,
    MinMax,
    MinMaxTotal,
} from 'src/app/types/min-max-total.interface';

import * as graphStatisticActions from '../actions/graph-statistics.actions';

export interface GraphStatisticsState {
    channelCapacity: MinMaxTotal;
    channelFees: MinMax;
}

const initialState: GraphStatisticsState = {
    channelCapacity: initMinMaxTotal,
    channelFees: initMinMax,
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
