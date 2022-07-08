import { createReducer, on } from '@ngrx/store';
import * as devModeActions from '../actions';

export interface DevMode {
    devModeEnabled: boolean;
}

const initialState: DevMode = {
    devModeEnabled: false,
};

export const reducer = createReducer(
    initialState,
    on(devModeActions.enableDevMode, (state) => ({
        ...state,
        devModeEnabled: true,
    })),
);
