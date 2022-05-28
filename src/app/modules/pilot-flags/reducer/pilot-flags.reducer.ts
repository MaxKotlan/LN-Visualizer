import { createReducer, on } from '@ngrx/store';

export interface PilotFlags {
    unitConversions: boolean;
    thickLines: boolean;
}

const initialState: PilotFlags = {
    unitConversions: false,
    thickLines: false,
};

export const reducer = createReducer(initialState);
