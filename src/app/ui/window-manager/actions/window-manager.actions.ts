import { createAction, props } from '@ngrx/store';

export const setModalOpen = createAction('[modal] setModalOpen', props<{ modalId: string }>());
export const setModalClose = createAction('[modal] setModalClose', props<{ modalId: string }>());

export const toggleModalPreference = createAction(
    '[window] toggleModalPreference',
    props<{ modalId: string }>(),
);

export const setModalPreference = createAction(
    '[window] setModalPreference',
    props<{ modalId: string; preference: 'modal' | 'sidebar' }>(),
);

export const modalIsBeingDragged = createAction(
    '[window] modalIsBeingDragged',
    props<{ isDragged: boolean }>(),
);
