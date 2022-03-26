import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DonateState } from '../reducers';

export const donateStateSelector = createFeatureSelector<DonateState>('donate');

export const selectInvoice = createSelector(donateStateSelector, (state) => state.invoice);

export const selectPaymentMethods = createSelector(donateStateSelector, (state) =>
    state.paymentMethods.filter((pm) => pm.activated),
);

export const selectIsLoading = createSelector(donateStateSelector, (state) => state.isLoading);

export const selectSelectedPaymentMethodName = createSelector(
    donateStateSelector,
    (state) => state.selectedPaymentMethod,
);

export const selectSelectedPaymentMethod = createSelector(
    selectPaymentMethods,
    selectSelectedPaymentMethodName,
    (paymentMethods, selectedName) =>
        paymentMethods.find((pm) => pm.paymentMethod === selectedName),
);
