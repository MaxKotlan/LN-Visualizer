import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { combineLatest, filter, from, map, mergeMap, of, tap } from 'rxjs';
import { cancelInvoice, createInvoice, createInvoiceSuccess } from '../actions/donate.actions';
import { LnVisInvoice } from '../models';
import { DonateApiService } from '../services/donate-api.service';

@Injectable()
export class DonateEffects {
    constructor(private actions$: Actions, private donateApiService: DonateApiService) {}

    createInvoice$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createInvoice),
            mergeMap(({ amount }) => this.donateApiService.createInvoice(amount)),
            tap(console.log),
            map((invoice: LnVisInvoice) => createInvoiceSuccess({ invoice })),
        ),
    );

    saveInvoiceAndPayment$ = createEffect(
        () =>
            combineLatest([this.actions$.pipe(ofType(createInvoiceSuccess))]).pipe(
                map(([invoice]) => [invoice.invoice]),
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
                mergeMap((info) => from([createInvoiceSuccess({ invoice: info.invoice })])),
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
