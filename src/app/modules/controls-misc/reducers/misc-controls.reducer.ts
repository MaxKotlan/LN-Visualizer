import { createReducer, on } from '@ngrx/store';
import * as controlsActions from '../../controls/actions';
import { initializeDefaultValue } from '../../controls/utils/default-settings-upgrader';
import * as miscActions from '../actions';

export interface MiscControlState {
    donateLinkVisible: boolean;
    displayUnit: 'btc' | 'mbtc' | 'sat';
}

const initialState: MiscControlState = {
    donateLinkVisible: true,
    displayUnit: 'sat',
};

export const reducer = createReducer(
    initialState,
    on(controlsActions.setSavedStateFromLocalStorage, (_state, { savedState }) =>
        initializeDefaultValue(savedState.miscControls, initialState),
    ),
    on(miscActions.setDonateLinkVisible, (state, { value }) => ({
        ...state,
        donateLinkVisible: value,
    })),
    on(miscActions.setDisplayUnit, (state, { value }) => ({
        ...state,
        displayUnit: value,
    })),
);
