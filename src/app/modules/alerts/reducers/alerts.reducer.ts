import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import * as alertsActions from '../actions/alerts.actions';
import { Alert } from '../models/alert.interface';

export interface AlertsState {
    alerts: Alert[];
}

export const initialState: AlertsState = {
    alerts: [],
};

export const reducer = createReducer(
    initialState,
    on(alertsActions.createAlert, (state, { alert }) => ({
        ...state,
        alerts: [alert, ...state.alerts],
    })),
    on(alertsActions.dismissAlert, (state, { message }) => ({
        ...state,
        alerts: state.alerts.filter((a) => a.message !== message),
    })),
);
