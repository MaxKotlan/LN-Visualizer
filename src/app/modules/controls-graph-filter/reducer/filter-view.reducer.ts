import { createReducer, on } from '@ngrx/store';
import * as filterViewActions from '../actions/filter-view.actions';

export interface FilterViewState {
    scriptType: 'node' | 'channel';
}

const initialState: FilterViewState = {
    scriptType: 'channel',
};

export const filterViewReducer = createReducer(
    initialState,
    on(filterViewActions.setScriptType, (state, { value }) => ({
        ...state,
        scriptType: value,
    })),
);
