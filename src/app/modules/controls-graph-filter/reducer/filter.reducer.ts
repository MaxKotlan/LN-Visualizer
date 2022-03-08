import { createReducer, on } from '@ngrx/store';
import { Filter } from '../types/filter.interface';
import _ from 'lodash';
import * as filterActions from '../actions';

export interface GraphFilterState {
    activeFilters: Filter<string | number>[];
    allowedFilterKeys: string[];
    allowedFilterOperators: string[];
}

const initialState: GraphFilterState = {
    activeFilters: [],
    allowedFilterKeys: [],
    allowedFilterOperators: ['>', '>=', '<', '<=', '!==', '==='],
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
    on(filterActions.setAllowedFilterKeys, (state, { value }) => ({
        ...state,
        allowedFilterKeys: value,
    })),
);
