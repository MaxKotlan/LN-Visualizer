import { createReducer } from '@ngrx/store';

export interface QuickControlsState {
    enableFilter: boolean;
}

const quickControlsStateInitialState: QuickControlsState = {
    enableFilter: false,
};

export const reducer = createReducer(quickControlsStateInitialState);
