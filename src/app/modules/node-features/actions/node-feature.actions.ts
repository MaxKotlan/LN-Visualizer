import { createAction, props } from '@ngrx/store';

export const updateFeaturesInView = createAction(
    '[node-features] updateFeaturesInView',
    props<{ value: boolean }>(),
);
