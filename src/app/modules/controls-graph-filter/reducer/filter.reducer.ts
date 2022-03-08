import { createReducer, on } from '@ngrx/store';
import { Filter } from '../types/filter.interface';

import * as filterActions from '../actions';

export interface GraphFilterState {
    activeFilters: Filter<string | number>[];
    allowedFilterKeys: string[];
    allowedFilterOperators: string[];
}

const initialState: GraphFilterState = {
    activeFilters: [],
    allowedFilterKeys: [],
    allowedFilterOperators: ['gt', 'gte', 'lt', 'lte', 'ne'],
};

export const reducer = createReducer(
    initialState,
    on(filterActions.addFilter, (state, { value }) => ({
        ...state,
        activeFilters: [...state.activeFilters, value],
    })),
    on(filterActions.setAllowedFilterKeys, (state, { value }) => ({
        ...state,
        allowedFilterKeys: value,
    })),
);
