import { createReducer, on } from '@ngrx/store';

export interface PilotFlags {
    unitConversions: boolean;
}

const initialState: PilotFlags = {
    unitConversions: false,
};

export const reducer = createReducer(initialState);
