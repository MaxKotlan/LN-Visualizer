import { createAction, props } from '@ngrx/store';
import { CameraFocusMode, GenericControlsState } from '../reducers/controls.reducer';

export const loadSavedState = createAction('[controls] loadSavedState');

export const setSavedStateFromLocalStorage = createAction(
    '[controls] setSavedStateFromLocalStorage',
    props<{ savedState: GenericControlsState }>(),
);

export const resetToDefault = createAction('[controls] resetToDefault');

export const resetControlsToDefault = createAction('[controls] resetControlsToDefault');

export const searchGraph = createAction(
    '[controls] setSearchString',
    props<{ searchText: string }>(),
);

export const renderLabels = createAction('[controls] renderLabels', props<{ value: boolean }>());

export const sortOrderChange = createAction(
    '[controls] setSortOrder',
    props<{ ascending: boolean }>(),
);

export const setCameraFov = createAction('[controls] setCameraFov', props<{ value: number }>());

export const setCameraFocusMode = createAction(
    '[controls] setCameraFocusMode',
    props<{ value: CameraFocusMode }>(),
);
