import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GraphFilterState } from '../reducer';
import { Filter } from '../types/filter.interface';

export const graphFilterState = createFeatureSelector<GraphFilterState>('graphFilterState');

export const activeFilters = createSelector(graphFilterState, (state) => state.activeFilters);

export const channelFilterKeys = createSelector(
    graphFilterState,
    (state) => state.channelFilterKeys,
);

export const nodeFilterKeys = createSelector(graphFilterState, (state) => state.nodeFilterKeys);

export const filterOperators = createSelector(graphFilterState, (state) => state.filterOperators);

export const isFilterActive = (issueId: string) =>
    createSelector(activeFilters, (filters) => filters.some((f) => f?.issueId === issueId));
