import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NodeFeaturesState } from '../reducer/node-features.reducer';

export const nodeFeaturesStateSelector =
    createFeatureSelector<NodeFeaturesState>('nodeFeaturesState');

export const nodeFeatures = createSelector(nodeFeaturesStateSelector, (state) =>
    state.nodeFeatures.sort((a, b) => a.bit - b.bit),
);

export const enabledFeatureBits = createSelector(nodeFeaturesStateSelector, (state) =>
    state.nodeFeatures.filter((f) => f.filterEnabled).map((f) => f.bit),
);

export const isNodeFeatureFilterEnabled = createSelector(
    nodeFeaturesStateSelector,
    (state) => state.enableFilter,
);
