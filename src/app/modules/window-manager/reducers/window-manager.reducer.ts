import { createReducer, on } from '@ngrx/store';
import * as windowMangementActions from '../actions';

export interface WindowManagerState {
    modalState: Record<string, 'open' | 'close'>;
    modalPreference: Record<string, 'modal' | 'sidebar'>;
}

const initialState: WindowManagerState = {
    modalState: {},
    modalPreference: {},
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
);
