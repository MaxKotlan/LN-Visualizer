
import { createReducer, on } from '@ngrx/store';
import * as controlsActions from '../actions/controls.actions';


export interface ControlsState {
    searchText: string,
    renderEdges: boolean,
    minimumEdges: number;
    sortAscending: boolean;
    nodeSize: number;
};

const initialState: ControlsState = {
    searchText: '',
    renderEdges: false,
    minimumEdges: 0,
    sortAscending: false,
    nodeSize: 3,
};

export const reducer = createReducer(
    initialState,
    on(
        controlsActions.searchGraph,
        (state, {searchText}) => ({...state, searchText })
    ),
    on(
        controlsActions.renderEdges,
        (state, {value}) => ({...state, renderEdges: value })
    ),
    on(
        controlsActions.minEdgesRecompute,
        (state, {minEdges}) => ({...state, minimumEdges: minEdges })
    ),
    on(
        controlsActions.setNodeSize,
        (state, {nodeSize}) => ({...state, nodeSize: nodeSize })
    ),
);
