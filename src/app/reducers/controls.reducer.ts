
import { createReducer, on } from '@ngrx/store';
import * as controlsActions from '../actions/controls.actions';


export interface ControlsState {
    searchText: string,
    renderEdges: boolean,
    minimumEdges: number;
    nodeSize: number;
    pointAttenuation: boolean;
    pointUseIcon: boolean;
};

const initialState: ControlsState = {
    searchText: '',
    renderEdges: false,
    minimumEdges: 0,
    nodeSize: 3,
    pointAttenuation: true,
    pointUseIcon: true
};

export const reducer = createReducer(
    initialState,
    on(controlsActions.setSavedStateFromLocalStorage,
        (state, {savedState}) => savedState
    ),
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
    on(
        controlsActions.setPointAttenuation,
        (state, {value}) => ({...state, pointAttenuation: value })
    ),
    on(
        controlsActions.setPointUseIcon,
        (state, {value}) => ({...state, pointUseIcon: value })
    )
);
