import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GraphFilterState } from '../reducer';
import { Filter } from '../types/filter.interface';

export const graphFilterState = createFeatureSelector<GraphFilterState>('graphFilterState');

export const activeFilters = createSelector(graphFilterState, (state) => state.activeFilters);

export const allowedFilterKeys = createSelector(
    graphFilterState,
    (state) => state.allowedFilterKeys,
);

export const allowedOperators = createSelector(
    graphFilterState,
    (state) => state.allowedFilterOperators,
);
