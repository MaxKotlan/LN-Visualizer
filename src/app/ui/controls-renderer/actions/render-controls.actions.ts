import { createAction, props } from '@ngrx/store';
import { Ray } from 'three';

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

export const setNodeTimeIntensity = createAction(
    '[controls] setNodeTimeIntensity',
    props<{ value: number }>(),
);

export const setRenderResolution = createAction(
    '[controls] setRenderResolution',
    props<{ value: number }>(),
);

export const setMouseRay = createAction('[controls] setMouseRay', props<{ value: Ray }>());
