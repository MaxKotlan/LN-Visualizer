import { createAction, props } from '@ngrx/store';

export const renderNodes = createAction('[controls] renderNodes', props<{ value: boolean }>());
export const gotoNode = createAction('[controls] gotoNode');
export const setNodeSize = createAction('[controls] setNodeSize', props<{ nodeSize: number }>());
export const setMinimumNodeSize = createAction(
    '[controls] setMinimumNodeSize',
    props<{ nodeSize: number }>(),
);

export const setPointAttenuation = createAction(
    '[controls] setPointAttenuation',
    props<{ value: boolean }>(),
);
export const setPointUseIcon = createAction(
    '[controls] setPointUseIcon',
    props<{ value: boolean }>(),
);
export const setUniformNodeSize = createAction(
    '[controls] uniformNodeSize',
    props<{ value: boolean }>(),
);

export const setNetworkFilter = createAction(
    '[controls] setNetworkFilter',
    props<{ value: string }>(),
);
