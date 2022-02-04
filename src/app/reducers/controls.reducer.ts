import { createReducer, on } from '@ngrx/store';
import * as controlsActions from '../actions/controls.actions';

export const enum CameraFocusMode {
    None,
    FocusOnly,
    Goto,
}

export interface ControlsState {
    searchText: string;
    renderNodes: boolean;
    renderEdges: boolean;
    renderLabels: boolean;
    minimumEdges: number;
    nodeSize: number;
    pointAttenuation: boolean;
    pointUseIcon: boolean;
    cameraFov: number;
    cameraFocusMode: CameraFocusMode;
    edgeDepthTest: boolean;
    edgeDottedLine: boolean;
    capacityFilterEnable: boolean;
    capacityFilterAmount: number;
}

const initialState: ControlsState = {
    searchText: '',
    renderNodes: true,
    renderEdges: true,
    renderLabels: false,
    minimumEdges: 0,
    nodeSize: 3,
    pointAttenuation: true,
    pointUseIcon: true,
    cameraFov: 60,
    cameraFocusMode: CameraFocusMode.FocusOnly,
    edgeDepthTest: false,
    edgeDottedLine: true,
    capacityFilterEnable: true,
    capacityFilterAmount: 8000000,
};

export const reducer = createReducer(
    initialState,
    on(controlsActions.setSavedStateFromLocalStorage, (_state, { savedState }) => savedState),
    on(controlsActions.resetControlsToDefault, () => initialState),
    on(controlsActions.searchGraph, (state, { searchText }) => ({ ...state, searchText })),
    on(controlsActions.renderNodes, (state, { value }) => ({ ...state, renderNodes: value })),
    on(controlsActions.renderEdges, (state, { value }) => ({ ...state, renderEdges: value })),
    on(controlsActions.renderLabels, (state, { value }) => ({ ...state, renderLabels: value })),
    on(controlsActions.minEdgesRecompute, (state, { minEdges }) => ({
        ...state,
        minimumEdges: minEdges,
    })),
    on(controlsActions.setNodeSize, (state, { nodeSize }) => ({ ...state, nodeSize: nodeSize })),
    on(controlsActions.setPointAttenuation, (state, { value }) => ({
        ...state,
        pointAttenuation: value,
    })),
    on(controlsActions.setPointUseIcon, (state, { value }) => ({ ...state, pointUseIcon: value })),
    on(controlsActions.setCameraFov, (state, { value }) => ({ ...state, cameraFov: value })),
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
