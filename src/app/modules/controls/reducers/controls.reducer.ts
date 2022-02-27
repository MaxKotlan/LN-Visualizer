import { createReducer, on } from '@ngrx/store';
import * as controlsActions from '../actions/controls.actions';

export const enum CameraFocusMode {
    None,
    FocusOnly,
    Goto,
}

export interface GenericControlsState {
    searchText: string;
    renderEdges: boolean;
    renderLabels: boolean;
    minimumEdges: number;
    cameraFov: number;
    cameraFocusMode: CameraFocusMode;
    edgeDepthTest: boolean;
    edgeDottedLine: boolean;
    capacityFilterEnable: boolean;
    capacityFilterAmount: number;
}

const initialState: GenericControlsState = {
    searchText: '',
    renderEdges: true,
    renderLabels: false,
    minimumEdges: 0,
    cameraFov: 60,
    cameraFocusMode: CameraFocusMode.FocusOnly,
    edgeDepthTest: true,
    edgeDottedLine: false,
    capacityFilterEnable: false,
    capacityFilterAmount: 8000000,
};

export const reducer = createReducer(
    initialState,
    on(controlsActions.setSavedStateFromLocalStorage, (_state, { savedState }) => savedState),
    on(controlsActions.resetControlsToDefault, () => initialState),
    on(controlsActions.searchGraph, (state, { searchText }) => ({ ...state, searchText })),
    on(controlsActions.renderEdges, (state, { value }) => ({ ...state, renderEdges: value })),
    on(controlsActions.renderLabels, (state, { value }) => ({ ...state, renderLabels: value })),
    on(controlsActions.minEdgesRecompute, (state, { minEdges }) => ({
        ...state,
        minimumEdges: minEdges,
    })),
    on(controlsActions.setCameraFov, (state, { value }) => ({ ...state, cameraFov: value })),
    on(controlsActions.setCameraFocusMode, (state, { value }) => ({
        ...state,
        cameraFocusMode: value,
    })),
    on(controlsActions.setEdgeUseDottedLine, (state, { value }) => ({
        ...state,
        edgeDottedLine: value,
    })),
    on(controlsActions.setEdgeUseDepthTest, (state, { value }) => ({
        ...state,
        edgeDepthTest: value,
    })),
    on(controlsActions.capacityFilterEnable, (state, { value }) => ({
        ...state,
        capacityFilterEnable: value,
    })),
    on(controlsActions.capacityFilterAmount, (state, { value }) => ({
        ...state,
        capacityFilterAmount: value,
    })),
);
