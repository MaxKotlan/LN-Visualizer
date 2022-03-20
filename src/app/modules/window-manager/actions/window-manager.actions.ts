import { createAction, props } from '@ngrx/store';

export const setModalOpen = createAction('[modal] setModalOpen', props<{ modalId: string }>());
export const setModalClose = createAction('[modal] setModalClose', props<{ modalId: string }>());

export const toggleModalPreference = createAction(
    '[modal] toggleModalPreference',
    props<{ modalId: string }>(),
);

export const setModalPreference = createAction(
    '[modal] setModalPreference',
    props<{ modalId: string; preference: 'modal' | 'sidebar' }>(),
);
