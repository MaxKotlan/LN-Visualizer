import { createReducer, on } from '@ngrx/store';
import * as controlsActions from '../actions/controls.actions';

export const enum CameraFocusMode {
    None,
    FocusOnly,
    Goto,
}

export interface GenericControlsState {
    searchText: string;
    renderLabels: boolean;
    cameraFov: number;
    cameraFocusMode: CameraFocusMode;
}

const initialState: GenericControlsState = {
    searchText: '',
    renderLabels: false,
    cameraFov: 60,
    cameraFocusMode: CameraFocusMode.FocusOnly,
};

export const reducer = createReducer(
    initialState,
    on(
        controlsActions.setSavedStateFromLocalStorage,
        (_state, { savedState }) => savedState.genericControls,
    ),
    on(controlsActions.resetControlsToDefault, () => initialState),
    on(controlsActions.searchGraph, (state, { searchText }) => ({ ...state, searchText })),
    on(controlsActions.renderLabels, (state, { value }) => ({ ...state, renderLabels: value })),
    on(controlsActions.setCameraFov, (state, { value }) => ({ ...state, cameraFov: value })),
    on(controlsActions.setCameraFocusMode, (state, { value }) => ({
        ...state,
        cameraFocusMode: value,
    })),
);
