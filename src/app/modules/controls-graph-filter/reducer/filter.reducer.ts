import { createReducer, on } from '@ngrx/store';
import { ChannelCallback, Filter, NodeCallback } from '../types/filter.interface';
import _ from 'lodash';
import * as filterActions from '../actions';

export interface GraphFilterState {
    activeNodeFilters: Filter<NodeCallback>[];
    activeChannelFilters: Filter<ChannelCallback>[];
    channelFilterKeys: string[];
    nodeFilterKeys: string[];
    filterOperators: string[];
}

const initialState: GraphFilterState = {
    activeNodeFilters: [],
    activeChannelFilters: [],
    channelFilterKeys: [],
    nodeFilterKeys: ['color', 'public_key', 'alias', 'position', 'totalCapacity', 'depth'],
    filterOperators: ['>', '>=', '<', '<=', '!=', '=='],
};

export const reducer = createReducer(
    initialState,
    on(filterActions.addChannelFilter, (state, { value }) => ({
        ...state,
        activeChannelFilters: [
            ...state.activeChannelFilters.filter((f) => !_.isEqual(f, value)),
            value,
        ],
    })),
    on(filterActions.removeChannelFilter, (state, { value }) => ({
        ...state,
        activeChannelFilters: state.activeChannelFilters.filter((f) => !_.isEqual(f, value)),
    })),
    on(filterActions.removeChannelFilterByIssueId, (state, { issueId }) => ({
        ...state,
        activeChannelFilters: state.activeChannelFilters.filter((f) => f.issueId !== issueId),
    })),
    on(filterActions.setAllowedFilterKeys, (state, { value }) => ({
        ...state,
        channelFilterKeys: value,
    })),
    on(filterActions.updateChannelFilterByIssueId, (state, { value }) => ({
        ...state,
        activeChannelFilters: [
            ...state.activeChannelFilters.filter((f) => f?.issueId != value?.issueId),
            value,
        ],
    })),
);
