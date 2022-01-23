import { createAction, props } from '@ngrx/store';
import { ControlsState } from '../reducers/controls.reducer';

export const loadSavedState = createAction('[controls] loadSavedState');

export const setSavedStateFromLocalStorage = createAction(
    '[controls] setSavedStateFromLocalStorage',
    props<{ savedState: ControlsState }>(),
);

export const resetToDefault = createAction('[controls] resetToDefault');

export const resetControlsToDefault = createAction('[controls] resetControlsToDefault');

export const searchGraph = createAction(
    '[controls] setSearchString',
    props<{ searchText: string }>(),
);

export const renderNodes = createAction('[controls] renderNodes', props<{ value: boolean }>());

export const renderEdges = createAction('[controls] renderEdges', props<{ value: boolean }>());

export const renderLabels = createAction('[controls] renderLabels', props<{ value: boolean }>());

export const sortOrderChange = createAction(
    '[controls] setSortOrder',
    props<{ ascending: boolean }>(),
);

export const gotoNode = createAction('[controls] gotoNode');

export const minEdgesRecompute = createAction(
    '[controls] setMinimumEdges',
    props<{ minEdges: number }>(),
);

export const setNodeSize = createAction('[controls] setNodeSize', props<{ nodeSize: number }>());

export const setPointAttenuation = createAction(
    '[controls] setPointAttenuation',
    props<{ value: boolean }>(),
);

export const setPointUseIcon = createAction(
    '[controls] setPointUseIcon',
    props<{ value: boolean }>(),
);

export const setCameraFov = createAction('[controls] setCameraFov', props<{ value: number }>());

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
