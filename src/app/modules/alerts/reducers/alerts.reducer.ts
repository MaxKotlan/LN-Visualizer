import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import * as alertsActions from '../actions/alerts.actions';

export interface AlertsState {
    alerts: string[];
}

export const initialState: AlertsState = {
    alerts: [],
};

export const reducer = createReducer(
    initialState,
    on(alertsActions.createAlert, (state, { message }) => ({
        ...state,
        alerts: [message, ...state.alerts],
    })),
    on(alertsActions.dismissAlert, (state, { message }) => ({
        ...state,
        alerts: state.alerts.filter((a) => a !== message),
    })),
);
