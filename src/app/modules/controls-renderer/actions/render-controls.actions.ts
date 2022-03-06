import { createAction, props } from '@ngrx/store';

export const setShowGrid = createAction(
    '[render-controls] setShowGrid',
    props<{ value: boolean }>(),
);
