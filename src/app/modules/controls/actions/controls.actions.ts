import { createAction, props } from '@ngrx/store';
import { CameraFocusMode } from '../reducers/controls.reducer';
import { ControlsState } from '../types';

export const loadSavedState = createAction('[controls] loadSavedState');

export const setSavedStateFromLocalStorage = createAction(
    '[controls] setSavedStateFromLocalStorage',
    props<{ savedState: ControlsState }>(),
);

export const resetToDefault = createAction('[controls] resetToDefault');

export const resetControlsToDefault = createAction('[controls] resetControlsToDefault');

export const searchGraph = createAction(
    '[controls] searchGraph',
    props<{ searchText: string; shouldUpdateSearchBar: boolean }>(),
);

export const renderLabels = createAction('[controls] renderLabels', props<{ value: boolean }>());

export const setCameraFov = createAction('[controls] setCameraFov', props<{ value: number }>());

export const setCameraFocusMode = createAction(
    '[controls] setCameraFocusMode',
    props<{ value: CameraFocusMode }>(),
);
