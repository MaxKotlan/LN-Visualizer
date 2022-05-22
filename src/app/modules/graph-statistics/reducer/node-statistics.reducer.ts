import { createReducer, on } from '@ngrx/store';
import { initMinMax, MinMax } from 'src/app/types/min-max-total.interface';
import * as nodeStatisticActions from '../actions/node-statistics.actions';

export interface NodeStatisticsState {
    channel_count: MinMax;
    node_capacity: MinMax;
}

const initialState: NodeStatisticsState = {
    channel_count: initMinMax,
    node_capacity: initMinMax,
};

export const reducer = createReducer(
    initialState,
    on(nodeStatisticActions.updateNodeMinMaxStatistic, (state, { property, newStatState }) => ({
        ...state,
        [property]: newStatState,
    })),
);
