import { HttpErrorResponse } from '@angular/common/http';
import { createReducer, on } from '@ngrx/store';
import {
    cancelInvoice,
    createInvoice,
    createInvoiceError,
    createInvoiceSuccess,
    selectPaymentMethod,
} from '../actions/donate.actions';
import { LnVisInvoice } from '../models';

export interface DonateState {
    invoice: LnVisInvoice | undefined;
    invoiceError: HttpErrorResponse;
    isLoading: boolean;
    selectedPaymentMethod: string;
}

const initialState: DonateState = {
    invoice: undefined,
    invoiceError: undefined,
    isLoading: false,
    selectedPaymentMethod: 'BTC-LightningNetwork',
};

export const reducer = createReducer(
    initialState,
    on(createInvoice, (state) => ({ ...state, isLoading: true, invoiceError: undefined })),
    on(createInvoiceSuccess, (state, { invoice }) => ({ ...state, invoice, isLoading: false })),
    on(createInvoiceError, (state, { error }) => ({
        ...state,
        invoiceError: error,
        isLoading: false,
    })),
    on(selectPaymentMethod, (state, { paymentMethodName }) => ({
        ...state,
        selectedPaymentMethod: paymentMethodName,
    })),
    on(cancelInvoice, () => initialState),
);
