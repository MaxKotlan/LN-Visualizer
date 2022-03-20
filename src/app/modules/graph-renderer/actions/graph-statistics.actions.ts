import { createAction, props } from '@ngrx/store';
import { MinMax, MinMaxTotal } from 'src/app/types/min-max-total.interface';

export const setChannelCapacityMinMax = createAction(
    '[graph] setChannelCapacityMinMax',
    props<{ channelCap: MinMaxTotal }>(),
);

export const setChannelFeesMinMax = createAction(
    '[graph] setChannelFeesMinMax',
    props<{ channelFees: MinMax }>(),
);
