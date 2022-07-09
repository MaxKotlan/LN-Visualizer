import { createAction, props } from '@ngrx/store';
import { MinMax, MinMaxTotal } from 'src/app/types/min-max-total.interface';
import { GraphStatisticsState } from '../models';

export const updateFilteredMinMaxStatistic = createAction(
    '[statistics] updateFilteredMinMaxStatistic',
    props<{ property: keyof GraphStatisticsState; newStatState: MinMaxTotal | MinMax }>(),
);

export const updateAllFilteredMinMaxStatistic = createAction(
    '[statistics] updateAllFilteredMinMaxStatistic',
    props<{ newState: GraphStatisticsState }>(),
);

export const clearFilteredMinMaxStatistic = createAction(
    '[statistics] clearFilteredMinMaxStatistic',
);
