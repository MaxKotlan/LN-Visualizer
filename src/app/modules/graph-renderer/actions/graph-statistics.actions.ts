import { createAction, props } from '@ngrx/store';
import { MinMax, MinMaxTotal } from 'src/app/types/min-max-total.interface';
import { GraphStatisticsState } from '../reducer/graph-statistics.reducer';

export const updateMinMaxStatistic = createAction(
    '[graph] setChannelCapacityMinMax',
    props<{ property: keyof GraphStatisticsState; newStatState: MinMaxTotal | MinMax }>(),
);
