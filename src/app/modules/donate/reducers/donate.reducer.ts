import { createReducer, on } from '@ngrx/store';
import {
    cancelInvoice,
    createInvoice,
    createInvoiceSuccess,
    selectPaymentMethod,
} from '../actions/donate.actions';
import { LnVisInvoice } from '../models';

export interface DonateState {
    invoice: LnVisInvoice | undefined;
    isLoading: boolean;
    selectedPaymentMethod: string;
}

const initialState: DonateState = {
    invoice: undefined,
    isLoading: false,
    selectedPaymentMethod: 'BTC-LightningNetwork',
};

export const reducer = createReducer(
    initialState,
    on(createInvoice, (state) => ({ ...state, isLoading: true })),
    on(createInvoiceSuccess, (state, { invoice }) => ({ ...state, invoice })),
    on(selectPaymentMethod, (state, { paymentMethodName }) => ({
        ...state,
        selectedPaymentMethod: paymentMethodName,
    })),
    on(cancelInvoice, (state) => initialState),
);
