import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NodeFeaturesState } from '../reducer/node-features.reducer';

export const nodeFeaturesStateSelector =
    createFeatureSelector<NodeFeaturesState>('nodeFeaturesState');

export const nodeFeatures = createSelector(nodeFeaturesStateSelector, (state) =>
    state.nodeFeatures.sort((a, b) => a.bit - b.bit),
);
