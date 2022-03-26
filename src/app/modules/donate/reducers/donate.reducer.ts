import { createReducer, on } from '@ngrx/store';
import {
    cancelInvoice,
    createInvoice,
    createInvoiceSuccess,
    getPaymentMethodsSuccess,
    selectPaymentMethod,
} from '../actions/donate.actions';
import { Invoice, PaymentMethod } from '../components/models';

export interface DonateState {
    invoice: Invoice | undefined;
    paymentMethods: PaymentMethod[];
    isLoading: boolean;
    selectedPaymentMethod: string;
}

const initialState: DonateState = {
    invoice: undefined,
    paymentMethods: [],
    isLoading: false,
    selectedPaymentMethod: 'BTC-LightningNetwork',
};

export const reducer = createReducer(
    initialState,
    on(createInvoice, (state) => ({ ...state, isLoading: true })),
    on(createInvoiceSuccess, (state, { invoice }) => ({ ...state, invoice })),
    on(getPaymentMethodsSuccess, (state, { paymentMethods }) => ({
        ...state,
        paymentMethods,
        isLoading: false,
    })),
    on(selectPaymentMethod, (state, { paymentMethodName }) => ({
        ...state,
        selectedPaymentMethod: paymentMethodName,
    })),
    on(cancelInvoice, (state) => initialState),
);
