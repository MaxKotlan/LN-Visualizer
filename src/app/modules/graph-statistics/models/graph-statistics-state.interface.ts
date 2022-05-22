import { MinMax, MinMaxTotal } from 'src/app/types/min-max-total.interface';

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
