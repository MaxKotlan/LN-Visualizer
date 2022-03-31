import { createReducer, on } from '@ngrx/store';
import * as controlsActions from '../../controls/actions';
import * as miscActions from '../actions';

export interface MiscControlState {
    donateLinkVisible: boolean;
}

const initialState: MiscControlState = {
    donateLinkVisible: true,
};

export const reducer = createReducer(
    initialState,
    on(
        controlsActions.setSavedStateFromLocalStorage,
        (_state, { savedState }) => savedState.miscControls || initialState,
    ),
    on(miscActions.setDonateLinkVisible, (state, { value }) => ({
        ...state,
        donateLinkVisible: value,
    })),
);
