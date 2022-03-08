import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GraphFilterState } from '../reducer';

export const graphFilterState = createFeatureSelector<GraphFilterState>('graphFilterState');

export const allowedFilterKeys = createSelector(
    graphFilterState,
    (state) => state.allowedFilterKeys,
);

export const allowedOperators = createSelector(
    graphFilterState,
    (state) => state.allowedFilterOperators,
);
