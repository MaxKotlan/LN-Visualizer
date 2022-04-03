import { createAction, props } from '@ngrx/store';
import { Alert } from '../models/alert.interface';

export const createAlert = createAction('[alerts] createAlert', props<{ alert: Alert }>());
export const dismissAlert = createAction('[alerts] dismissAlert', props<{ message: string }>());
