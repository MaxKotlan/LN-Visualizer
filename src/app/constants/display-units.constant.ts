import { GraphStatisticsState } from 'src/app/graph-data/graph-statistics/models';
import { UnitLabel } from '../ui/unit-conversions/service';

export const displayUnits: string[] = ['btc', 'sat', 'msat'];

export type UnitLabelOrNumber = UnitLabel | 'number';

export const backendUnitFormat: Record<keyof GraphStatisticsState, UnitLabelOrNumber> = {
    node_channel_count: 'number',
    node_capacity: 'sat',
    capacity: 'sat',
    base_fee_mtokens: 'msat',
    cltv_delta: 'number',
    fee_rate: 'msat',
    max_htlc_mtokens: 'msat',
    min_htlc_mtokens: 'msat',
};
