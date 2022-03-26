import { createAction, props } from '@ngrx/store';
import { Invoice, PaymentMethod } from '../components/models';

export const createInvoice = createAction('[donate] createInvoice', props<{ amount: number }>());

export const createInvoiceSuccess = createAction(
    '[donate] createInvoiceSuccess',
    props<{ invoice: Invoice }>(),
);

export const getPaymentMethods = createAction(
    '[donate] getPaymentMethods',
    props<{ invoiceId: string }>(),
);

export const getPaymentMethodsSuccess = createAction(
    '[donate] getPaymentMethodsSuccess',
    props<{ paymentMethods: PaymentMethod[] }>(),
);

export const selectPaymentMethod = createAction(
    '[donate] selectPaymentMethod',
    props<{ paymentMethodName: string }>(),
);

export const cancelInvoice = createAction('[donate] cancelInvoice');
