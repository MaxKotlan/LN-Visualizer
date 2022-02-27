import { createAction, props } from '@ngrx/store';

export const renderEdges = createAction('[controls] renderEdges', props<{ value: boolean }>());
export const minEdgesRecompute = createAction(
    '[controls] setMinimumEdges',
    props<{ minEdges: number }>(),
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
