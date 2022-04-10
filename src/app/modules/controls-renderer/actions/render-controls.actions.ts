import { createAction, props } from '@ngrx/store';

export const setShowGrid = createAction(
    '[render-controls] setShowGrid',
    props<{ value: boolean }>(),
);

export const setShowAxis = createAction(
    '[render-controls] setShowAxis',
    props<{ value: boolean }>(),
);

export const setShowGraphAnimation = createAction(
    '[render-controls] setShowGraphAnimation',
    props<{ value: boolean }>(),
);

export const setNodeMotionIntensity = createAction(
    '[controls] setNodeMotionIntensity',
    props<{ value: number }>(),
);
