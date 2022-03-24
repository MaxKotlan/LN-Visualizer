import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GraphFilterState } from '../reducer';

export const graphFilterState = createFeatureSelector<GraphFilterState>('graphFilterState');

export const activeChannelFilters = createSelector(
    graphFilterState,
    (state) => state.activeChannelFilters,
);

export const channelFilterKeys = createSelector(
    graphFilterState,
    (state) => state.channelFilterKeys,
);

export const isFilterActive = (issueId: string) =>
    createSelector(activeChannelFilters, (filters) => filters.some((f) => f?.issueId === issueId));
