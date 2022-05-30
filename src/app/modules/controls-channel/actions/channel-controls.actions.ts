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

export const setChannelColor = createAction(
    '[controls] setChannelColor',
    props<{ value: string }>(),
);

export const setChannelColorMap = createAction(
    '[controls] setChannelColorMap',
    props<{ value: string }>(),
);

export const useLogColorScale = createAction(
    '[controls] useLogColorScale',
    props<{ value: boolean }>(),
);

export const enableChannelFog = createAction(
    '[controls] enableChannelFog',
    props<{ value: boolean }>(),
);

export const setChannelWidth = createAction(
    '[controls] setChannelWidth',
    props<{ value: number }>(),
);

export const setLineBackend = createAction(
    '[controls] setLineBackend',
    props<{ value: 'gl-line' | 'line-mesh' }>(),
);

export const setFogDistance = createAction('[controls] setFogDistance', props<{ value: number }>());
