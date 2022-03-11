import { createReducer, on } from '@ngrx/store';
import { Filter } from '../types/filter.interface';
import _ from 'lodash';
import * as filterActions from '../actions';

export interface GraphFilterState {
    activeFilters: Filter[];
    channelFilterKeys: string[];
    nodeFilterKeys: string[];
    filterOperators: string[];
}

const initialState: GraphFilterState = {
    activeFilters: [],
    channelFilterKeys: [],
    nodeFilterKeys: ['color', 'public_key', 'alias', 'position', 'totalCapacity', 'depth'],
    filterOperators: ['>', '>=', '<', '<=', '!=', '=='],
};

export const reducer = createReducer(
    initialState,
    on(filterActions.addFilter, (state, { value }) => ({
        ...state,
        activeFilters: [...state.activeFilters.filter((f) => !_.isEqual(f, value)), value],
    })),
    on(filterActions.removeFilter, (state, { value }) => ({
        ...state,
        activeFilters: state.activeFilters.filter((f) => !_.isEqual(f, value)),
    })),
    on(filterActions.removeFilterByKey, (state, { key }) => ({
        ...state,
        activeFilters: state.activeFilters.filter((f) => !f.expression.includes(key)),
    })),
    on(filterActions.setAllowedFilterKeys, (state, { value }) => ({
        ...state,
        channelFilterKeys: value,
    })),
);
