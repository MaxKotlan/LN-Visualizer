import { createAction, props } from '@ngrx/store';

export const setDonateLinkVisible = createAction(
    '[misc controls] setDonateLinkVisible',
    props<{ value: boolean }>(),
);

export const setDisplayUnit = createAction(
    '[misc controls] setDisplayUnit',
    props<{ value: 'btc' | 'mbtc' | 'sat' }>(),
);
