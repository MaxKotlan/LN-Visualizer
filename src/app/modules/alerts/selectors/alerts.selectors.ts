import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlertsState } from '../reducers';

export const alertsStateSelector = createFeatureSelector<AlertsState>('alerts');

export const selectTopAlert = createSelector(alertsStateSelector, (state) => state.alerts[0]);
