import { createReducer, on } from '@ngrx/store';
import * as pilotFlagActions from '../actions';

export interface PilotFlags {
    unitConversions: boolean;
    thickLines: boolean;
    fastModelDownload: boolean;
    colorRangeMinMax: boolean;
}

const initialState: PilotFlags = {
    unitConversions: false,
    thickLines: true,
    fastModelDownload: false,
    colorRangeMinMax: false,
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
