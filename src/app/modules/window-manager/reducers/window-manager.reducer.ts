import { createReducer, on } from '@ngrx/store';
import * as windowMangementActions from '../actions';
import { filterScriptsId, quickControlsId } from '../constants/windowIds';

export interface WindowManagerState {
    modalState: Record<string, 'open' | 'close'>;
    modalPreference: Record<string, 'modal' | 'sidebar'>;
}

const initialState: WindowManagerState = {
    modalState: {
        [quickControlsId]: 'open',
        [filterScriptsId]: 'close',
    },
    modalPreference: {
        [quickControlsId]: 'modal',
        [filterScriptsId]: 'modal',
    },
};

export const reducer = createReducer(
    initialState,
    on(windowMangementActions.setModalOpen, (state, { modalId }) => ({
        ...state,
        modalState: { ...state.modalState, [modalId]: 'open' },
    })),
    on(windowMangementActions.setModalClose, (state, { modalId }) => ({
        ...state,
        modalState: { ...state.modalState, [modalId]: 'close' },
    })),
    on(windowMangementActions.setModalPreference, (state, { modalId, preference }) => ({
        ...state,
        modalPreference: { ...state.modalPreference, [modalId]: preference },
    })),
    on(windowMangementActions.toggleModalPreference, (state, { modalId }) => ({
        ...state,
        modalPreference: {
            ...state.modalPreference,
            [modalId]: state.modalPreference[modalId] === 'modal' ? 'sidebar' : 'modal',
        },
    })),
);
