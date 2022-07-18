import { createReducer, on } from '@ngrx/store';
import * as pilotFlagActions from '../actions';
import pilotFlagJson from '../../../../assets/pilot-flags.json';

export interface PilotFlags {
    unitConversions: boolean;
    thickLines: boolean;
    sphereNodes: boolean;
    fastModelDownload: boolean;
    colorRangeMinMax: boolean;
    nodeTableSearch: boolean;
}

const initialState: PilotFlags = pilotFlagJson;

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
