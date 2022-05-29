import { createAction, props } from '@ngrx/store';

export const setPilotFlag = createAction(
    '[pilot flags] setPilotFlag',
    props<{ pilotName: string; value: boolean }>(),
);
