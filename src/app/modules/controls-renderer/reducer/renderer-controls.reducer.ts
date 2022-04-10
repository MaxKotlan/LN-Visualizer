import { createReducer, on } from '@ngrx/store';
import * as controlActions from '../../controls/actions';
import * as renderControlActions from '../actions';

export interface RendererControlState {
    showGrid: boolean;
    showAxis: boolean;
    showGraphAnimation: boolean;
    nodeMotionIntensity: number;
    nodeTimeIntensity: number;
}

const initialState: RendererControlState = {
    showGrid: true,
    showAxis: false,
    showGraphAnimation: true,
    nodeMotionIntensity: 0.03,
    nodeTimeIntensity: 0.001,
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
    on(renderControlActions.setShowGraphAnimation, (state, { value }) => ({
        ...state,
        showGraphAnimation: value,
    })),
    on(renderControlActions.setNodeMotionIntensity, (state, { value }) => ({
        ...state,
        nodeMotionIntensity: value,
    })),
    on(renderControlActions.setNodeTimeIntensity, (state, { value }) => ({
        ...state,
        nodeTimeIntensity: value,
    })),
);
