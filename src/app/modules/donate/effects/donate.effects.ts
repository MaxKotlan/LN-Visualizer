import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { combineLatest, filter, from, map, mergeMap, of, tap } from 'rxjs';
import {
    cancelInvoice,
    createInvoice,
    createInvoiceSuccess,
    getPaymentMethods,
    getPaymentMethodsSuccess,
} from '../actions/donate.actions';
import { Invoice, PaymentMethod } from '../components/models';
import { DonateApiService } from '../services/donate-api.service';

@Injectable()
export class DonateEffects {
    constructor(private actions$: Actions, private donateApiService: DonateApiService) {}

    createInvoice$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createInvoice),
            mergeMap(({ amount }) => this.donateApiService.createInvoice(amount)),
            tap(console.log),
            map((invoice: Invoice) => createInvoiceSuccess({ invoice })),
        ),
    );

    invoiceToPaymentMethods$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createInvoiceSuccess),
            map(({ invoice }) => getPaymentMethods({ invoiceId: invoice.id })),
        ),
    );

    getPaymentMethods$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getPaymentMethods),
            mergeMap(({ invoiceId }) => this.donateApiService.getPaymentMethods(invoiceId)),
            map((paymentMethods: PaymentMethod[]) => getPaymentMethodsSuccess({ paymentMethods })),
        ),
    );

    saveInvoiceAndPayment$ = createEffect(
        () =>
            combineLatest([
                this.actions$.pipe(ofType(createInvoiceSuccess)),
                this.actions$.pipe(ofType(getPaymentMethodsSuccess)),
            ]).pipe(
                map(([invoice, paymentMethods]) => [
                    invoice.invoice,
                    paymentMethods.paymentMethods,
                ]),
                tap(([invoice, paymentMethods]) =>
                    localStorage.setItem(
                        'paymentInfo',
                        JSON.stringify({ invoice, paymentMethods }),
                    ),
                ),
            ),
        { dispatch: false },
    );

    loadInvoiceAndPayment$ = createEffect(
        () =>
            of('init').pipe(
                map(() => JSON.parse(localStorage.getItem('paymentInfo'))),
                filter((info) => !!info),
                mergeMap((info) =>
                    from([
                        createInvoiceSuccess({ invoice: info.invoice }),
                        getPaymentMethodsSuccess({ paymentMethods: info.paymentMethods }),
                    ]),
                ),
            ),
        { dispatch: true },
    );

    cancelInvoice$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(cancelInvoice),
                tap(() => localStorage.removeItem('paymentInfo')),
            ),
        { dispatch: false },
    );
}
