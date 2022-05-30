import { createAction, props } from '@ngrx/store';
import { PilotFlags } from '../reducer';

export const setPilotFlag = createAction(
    '[pilot flags] setPilotFlag',
    props<{ pilotName: string; value: boolean }>(),
);

export const setAllPilotFlags = createAction(
    '[pilot flags] setPilotFlag',
    props<{ value: PilotFlags }>(),
);
