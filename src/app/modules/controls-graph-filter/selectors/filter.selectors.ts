import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GraphFilterState } from '../reducer';

export const graphFilterState = createFeatureSelector<GraphFilterState>('graphFilterState');

export const activeChannelFilters = createSelector(
    graphFilterState,
    (state) => state.activeChannelFilters,
);

export const activeNodeFilters = createSelector(
    graphFilterState,
    (state) => state.activeNodeFilters,
);

export const channelFilterKeys = createSelector(
    graphFilterState,
    (state) => state.channelFilterKeys,
);

export const isFilterActive = (issueId: string) =>
    createSelector(
        activeChannelFilters,
        activeNodeFilters,
        (channelFilters, nodeFilters) =>
            channelFilters.some((f) => f?.issueId === issueId) ||
            nodeFilters.some((f) => f?.issueId === issueId),
    );
