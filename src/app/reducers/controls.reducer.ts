
import { createReducer, on } from '@ngrx/store';
import * as controlsActions from '../actions/controls.actions';


export interface ControlsState {
    searchText: string,
    renderEdges: boolean,
    minimumEdges: number;
    sortAscending: boolean;
};

const initialState: ControlsState = {
    searchText: '',
    renderEdges: false,
    minimumEdges: 0,
    sortAscending: false,
};

export const reducer = createReducer(
    initialState,
    on(
        controlsActions.searchGraph,
        (state, {searchText}) => ({...state, searchText })
    ),
);
