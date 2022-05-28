import { createReducer, on } from '@ngrx/store';
import * as controlsActions from '../actions/controls.actions';

export type CameraFocusMode = 'goto' | 'lookat' | 'none';

export interface GenericControlsState {
    controlVersion: string;
    searchText: string;
    renderLabels: boolean;
    shouldUpdateSearchBar: boolean;
    cameraFov: number;
    cameraFocusMode: CameraFocusMode;
}

export const initialState: GenericControlsState = {
    controlVersion: '1',
    searchText: '',
    renderLabels: false,
    shouldUpdateSearchBar: false,
    cameraFov: 60,
    cameraFocusMode: 'goto',
};

export const reducer = createReducer(
    initialState,
    on(
        controlsActions.setSavedStateFromLocalStorage,
        (_state, { savedState }) => savedState.genericControls || initialState,
    ),
    on(controlsActions.resetControlsToDefault, () => initialState),
    on(controlsActions.searchGraph, (state, { searchText, shouldUpdateSearchBar }) => ({
        ...state,
        searchText,
        shouldUpdateSearchBar,
    })),
    on(controlsActions.renderLabels, (state, { value }) => ({ ...state, renderLabels: value })),
    on(controlsActions.setCameraFov, (state, { value }) => ({ ...state, cameraFov: value })),
    on(controlsActions.setCameraFocusMode, (state, { value }) => ({
        ...state,
        cameraFocusMode: value,
    })),
);
