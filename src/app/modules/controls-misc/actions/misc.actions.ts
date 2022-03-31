import { createAction, props } from '@ngrx/store';

export const setDonateLinkVisible = createAction(
    '[misc controls] setDonateLinkVisible',
    props<{ value: boolean }>(),
);
