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
    base_fee_mtokens: MinMax;
    cltv_delta: MinMax;
    fee_rate: MinMax;
    max_htlc_mtokens: MinMax;
    min_htlc_mtokens: MinMax;
}

export const initialStatisticsState: GraphStatisticsState = {
    channel_count: initMinMax,
    node_capacity: initMinMax,
    capacity: initMinMaxTotal,
    base_fee_mtokens: initMinMax,
    cltv_delta: initMinMax,
    fee_rate: initMinMax,
    max_htlc_mtokens: initMinMax,
    min_htlc_mtokens: initMinMax,
};
