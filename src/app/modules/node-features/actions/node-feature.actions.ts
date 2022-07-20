import { createAction, props } from '@ngrx/store';
import { NodeFeature } from '../reducer/node-features.reducer';

export const updateFeaturesInView = createAction(
    '[node-features] updateFeaturesInView',
    props<{ newNodeFeatures: NodeFeature[] }>(),
);

export const updateFeatureFilter = createAction(
    '[node-features] updateFeatureFilter',
    props<{ bit: number; newValue: boolean }>(),
);

export const clearFeaturesInView = createAction('[node-features] clearFeaturesInView');
