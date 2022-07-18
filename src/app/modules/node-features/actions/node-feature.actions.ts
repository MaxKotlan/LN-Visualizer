import { createAction, props } from '@ngrx/store';
import { NodeFeature } from '../reducer/node-features.reducer';

export const updateFeaturesInView = createAction(
    '[node-features] updateFeaturesInView',
    props<{ newNodeFeatures: NodeFeature[] }>(),
);

export const clearFeaturesInView = createAction('[node-features] clearFeaturesInView');
