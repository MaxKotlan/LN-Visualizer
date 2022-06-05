import { createReducer, on } from '@ngrx/store';
import * as pilotFlagActions from '../actions';

export interface PilotFlags {
    unitConversions: boolean;
    thickLines: boolean;
    depthFilter: boolean;
}

const initialState: PilotFlags = {
    unitConversions: false,
    thickLines: true,
    depthFilter: false,
};

export const reducer = createReducer(
    initialState,
    on(pilotFlagActions.setPilotFlag, (state, { pilotName, value }) => ({
        ...state,
        [pilotName]: value,
    })),
    on(pilotFlagActions.setAllPilotFlags, (state, { value }) => ({
        ...value,
    })),
);
