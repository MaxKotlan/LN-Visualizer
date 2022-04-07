import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { LnVisInvoice } from '../models';

export const createInvoice = createAction('[donate] createInvoice', props<{ amount: number }>());

export const createInvoiceSuccess = createAction(
    '[donate] createInvoiceSuccess',
    props<{ invoice: LnVisInvoice }>(),
);

export const subscribeToInvoiceUpdates = createAction(
    '[donate] subscribeToInvoiceUpdates',
    props<{ id: string }>(),
);

export const unsubscribeToInvoiceUpdates = createAction(
    '[donate] unsubscribeToInvoiceUpdates',
    props<{ id: string }>(),
);

export const createInvoiceError = createAction(
    '[donate] createInvoiceError',
    props<{ error: HttpErrorResponse }>(),
);

export const selectPaymentMethod = createAction(
    '[donate] selectPaymentMethod',
    props<{ paymentMethodName: string }>(),
);

export const cancelInvoice = createAction('[donate] cancelInvoice');
