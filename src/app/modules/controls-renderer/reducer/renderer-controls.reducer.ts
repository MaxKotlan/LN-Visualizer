import { createReducer, on } from '@ngrx/store';
import * as controlActions from '../../controls/actions';
import * as renderControlActions from '../actions';

export interface RendererControlState {
    showGrid: boolean;
    showAxis: boolean;
}

const initialState: RendererControlState = {
    showGrid: true,
    showAxis: false,
};

export const reducer = createReducer(
    initialState,
    on(
        controlActions.setSavedStateFromLocalStorage,
        (_state, { savedState }) => savedState.renderControls || initialState,
    ),
    on(controlActions.resetControlsToDefault, () => initialState),
    on(renderControlActions.setShowGrid, (state, { value }) => ({
        ...state,
        showGrid: value,
    })),
    on(renderControlActions.setShowAxis, (state, { value }) => ({
        ...state,
        showAxis: value,
    })),
);
