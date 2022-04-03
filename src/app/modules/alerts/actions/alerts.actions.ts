import { createAction, props } from '@ngrx/store';

export const createAlert = createAction('[alerts] createAlert', props<{ message: string }>());
export const dismissAlert = createAction('[alerts] dismissAlert', props<{ message: string }>());
