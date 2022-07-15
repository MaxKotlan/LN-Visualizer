import {
    initMinMax,
    initMinMaxTotal,
    MinMax,
    MinMaxTotal,
} from 'src/app/types/min-max-total.interface';

export interface GraphStatisticsState {
    channel_count: MinMax;
    node_capacity: MinMax;
    capacity: MinMaxTotal;
    base_fee_mtokens: MinMaxTotal;
    cltv_delta: MinMaxTotal;
    fee_rate: MinMaxTotal;
    max_htlc_mtokens: MinMaxTotal;
    min_htlc_mtokens: MinMaxTotal;
}

export const initialStatisticsState: GraphStatisticsState = {
    channel_count: initMinMax,
    node_capacity: initMinMax,
    capacity: initMinMaxTotal,
    base_fee_mtokens: initMinMaxTotal,
    cltv_delta: initMinMaxTotal,
    fee_rate: initMinMaxTotal,
    max_htlc_mtokens: initMinMaxTotal,
    min_htlc_mtokens: initMinMaxTotal,
};
