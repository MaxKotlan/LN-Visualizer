import { createReducer, on } from '@ngrx/store';
import * as devModeActions from '../actions';

export interface DevModeState {
    devModeEnabled: boolean;
}

const initialState: DevModeState = {
    devModeEnabled: true,
};

export const reducer = createReducer(
    initialState,
    on(devModeActions.enableDevMode, (state) => ({
        ...state,
        devModeEnabled: true,
    })),
);
