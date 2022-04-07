import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PaymentMethod } from '../models';
import { DonateState } from '../reducers';

export const donateStateSelector = createFeatureSelector<DonateState>('donate');

export const selectInvoice = createSelector(donateStateSelector, (state) => state.invoice);

export const selectPaymentMethods = createSelector(
    donateStateSelector,
    (state) =>
        state?.invoice?.checkout?.paymentMethods?.filter((pm) => pm.activated) as PaymentMethod[],
);

export const selectIsLoading = createSelector(donateStateSelector, (state) => state.isLoading);

export const selectSelectedPaymentMethodName = createSelector(
    donateStateSelector,
    (state) => state.selectedPaymentMethod,
);

export const selectInvoiceError = createSelector(
    donateStateSelector,
    (state) => state.invoiceError,
);

export const paymentSettled = createSelector(
    donateStateSelector,
    (state) => state?.invoice?.status === 'Settled',
);

export const selectSelectedPaymentMethod = createSelector(
    selectPaymentMethods,
    selectSelectedPaymentMethodName,
    (paymentMethods, selectedName) =>
        paymentMethods?.find((pm) => pm.paymentMethod === selectedName),
);
