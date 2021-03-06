import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    catchError,
    distinctUntilChanged,
    filter,
    from,
    map,
    mergeMap,
    of,
    pairwise,
    startWith,
    tap,
} from 'rxjs';
import {
    cancelInvoice,
    createInvoice,
    createInvoiceError,
    createInvoiceSuccess,
    subscribeToInvoiceUpdates,
    unsubscribeToInvoiceUpdates,
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

    mapToInvoiceUpdate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createInvoiceSuccess),
            map((invoice) => invoice.invoice.id),
            distinctUntilChanged(),
            startWith(null),
            pairwise(),
            mergeMap(([oldId, newId]) => {
                return from([
                    unsubscribeToInvoiceUpdates({ id: oldId }),
                    subscribeToInvoiceUpdates({ id: newId }),
                ]);
            }),
        ),
    );

    subscribeToInvoiceUpdates$ = createEffect(() =>
        this.actions$.pipe(
            ofType(subscribeToInvoiceUpdates),
            map((action) => action.id),
            tap((id) => console.log(`Subscribing to ${id}`)),
            mergeMap((id) =>
                this.donateApiService
                    .subscribeToInvoiceUpdates(id)
                    .pipe(map((invoice) => createInvoiceSuccess({ invoice }))),
            ),
        ),
    );

    unsubscribeToInvoiceUpdates$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(unsubscribeToInvoiceUpdates),
                map((action) => action.id),
                tap((id) => console.log(`Unsubscribing to ${id}`)),
                tap((id) => this.donateApiService.unsubscribeFromUpdates(id)),
                tap(() => localStorage.removeItem('paymentInfo')),
            ),
        { dispatch: false },
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
                map(() =>
                    unsubscribeToInvoiceUpdates({
                        id: JSON.parse(localStorage.getItem('paymentInfo'))?.invoice?.id,
                    }),
                ),
            ),
        { dispatch: true },
    );
}
