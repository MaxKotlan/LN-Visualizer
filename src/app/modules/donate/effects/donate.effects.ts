import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatest, filter, from, map, mergeMap, of, tap } from 'rxjs';
import {
    cancelInvoice,
    createInvoice,
    createInvoiceError,
    createInvoiceSuccess,
} from '../actions/donate.actions';
import { LnVisInvoice } from '../models';
import { DonateApiService } from '../services/donate-api.service';

@Injectable()
export class DonateEffects {
    constructor(private actions$: Actions, private donateApiService: DonateApiService) {}

    createInvoice$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createInvoice),
            mergeMap(({ amount }) =>
                this.donateApiService.createInvoice(amount).pipe(
                    map((invoice: LnVisInvoice) => createInvoiceSuccess({ invoice })),
                    catchError((error: HttpErrorResponse) => of(createInvoiceError({ error }))),
                ),
            ),
        ),
    );

    saveInvoiceAndPayment$ = createEffect(
        () =>
            this.actions$.pipe(ofType(createInvoiceSuccess)).pipe(
                map((invoice) => invoice.invoice),
                tap((invoice) => localStorage.setItem('paymentInfo', JSON.stringify({ invoice }))),
            ),
        { dispatch: false },
    );

    loadInvoiceAndPayment$ = createEffect(
        () =>
            of('init').pipe(
                map(() => JSON.parse(localStorage.getItem('paymentInfo'))),
                filter((info) => !!info),
                map((info) => createInvoiceSuccess({ invoice: info.invoice })),
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
