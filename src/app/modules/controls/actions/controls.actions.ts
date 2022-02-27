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

export const renderEdges = createAction('[controls] renderEdges', props<{ value: boolean }>());

export const renderLabels = createAction('[controls] renderLabels', props<{ value: boolean }>());

export const sortOrderChange = createAction(
    '[controls] setSortOrder',
    props<{ ascending: boolean }>(),
);

export const minEdgesRecompute = createAction(
    '[controls] setMinimumEdges',
    props<{ minEdges: number }>(),
);

export const setCameraFov = createAction('[controls] setCameraFov', props<{ value: number }>());

export const setCameraFocusMode = createAction(
    '[controls] setCameraFocusMode',
    props<{ value: CameraFocusMode }>(),
);

export const setEdgeUseDottedLine = createAction(
    '[controls] setEdgeUseDottedLine',
    props<{ value: boolean }>(),
);

export const setEdgeUseDepthTest = createAction(
    '[controls] setEdgeUseDepthTest',
    props<{ value: boolean }>(),
);

export const capacityFilterEnable = createAction(
    '[controls] capacityFilterEnable',
    props<{ value: boolean }>(),
);

export const capacityFilterAmount = createAction(
    '[controls] capacityFilterAmount',
    props<{ value: number }>(),
);
