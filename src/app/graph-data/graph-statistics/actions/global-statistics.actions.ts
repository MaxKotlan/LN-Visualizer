import { createAction, props } from '@ngrx/store';
import { MinMaxTotal } from 'src/app/types/min-max-total.interface';
import { GraphStatisticsState } from '../models';

export const updateGlobalMinMaxStatistic = createAction(
    '[statistics] updateGlobalMinMaxStatistic',
    props<{ property: keyof GraphStatisticsState; newStatState: MinMaxTotal }>(),
);

export const updateAllGlobalMinMaxStatistic = createAction(
    '[statistics] updateAllGlobalMinMaxStatistic',
    props<{ newState: GraphStatisticsState }>(),
);
