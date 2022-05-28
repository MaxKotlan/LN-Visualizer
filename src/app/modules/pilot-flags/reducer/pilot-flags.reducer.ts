import { createReducer, on } from '@ngrx/store';
import * as pilotFlagActions from '../actions';

export interface PilotFlags {
    unitConversions: boolean;
    thickLines: boolean;
}

const initialState: PilotFlags = {
    unitConversions: false,
    thickLines: false,
};

export const reducer = createReducer(
    initialState,
    on(pilotFlagActions.enableThickLines, (state) => ({
        ...state,
        thickLines: true,
    })),
);
