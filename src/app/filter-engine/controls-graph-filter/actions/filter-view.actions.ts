import { createAction, props } from '@ngrx/store';

export const setEvalMode = createAction(
    '[filter-view] setEvalMode',
    props<{ value: 'add' | 'type' }>(),
);

export const setScriptType = createAction(
    '[filter-view] setScriptType',
    props<{ value: 'node' | 'channel' }>(),
);

export const setScriptSource = createAction(
    '[filter-view] setScriptSource',
    props<{ value: string }>(),
);
