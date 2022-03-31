import { createReducer, on } from '@ngrx/store';
import {
    ChannelEvaluationFunction,
    Filter,
    NodeEvaluationFunction,
} from '../types/filter.interface';
import _ from 'lodash';
import * as filterActions from '../actions';

export interface GraphFilterState {
    activeNodeFilters: Filter<NodeEvaluationFunction>[];
    activeChannelFilters: Filter<ChannelEvaluationFunction>[];
    channelFilterKeys: string[];
}

const initialState: GraphFilterState = {
    activeNodeFilters: [],
    activeChannelFilters: [],
    channelFilterKeys: [],
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
        activeNodeFilters: state.activeNodeFilters.filter((f) => !_.isEqual(f, value)),
    })),
    on(filterActions.removeChannelFilterByIssueId, (state, { issueId }) => ({
        ...state,
        activeChannelFilters: state.activeChannelFilters.filter((f) => f.issueId !== issueId),
        activeNodeFilters: state.activeNodeFilters.filter((f) => f.issueId !== issueId),
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
    on(filterActions.updateNodeFilterByIssueId, (state, { value }) => ({
        ...state,
        activeNodeFilters: [
            ...state.activeNodeFilters.filter((f) => f?.issueId != value?.issueId),
            value,
        ],
    })),
);
