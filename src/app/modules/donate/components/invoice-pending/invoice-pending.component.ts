import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { cancelInvoice, selectPaymentMethod } from '../../actions/donate.actions';
import { DonateState } from '../../reducers';
import {
    selectInvoice,
    selectInvoiceStatus,
    selectIsLoading,
    selectPaymentMethods,
    selectSelectedPaymentMethod,
    selectSelectedPaymentMethodName,
} from '../../selectors/donate.selectors';
import { Clipboard } from '@angular/cdk/clipboard';
import { combineLatest, filter, interval, map, Observable, startWith, timer } from 'rxjs';
import { PaymentMethod } from '../../models/payment-methods.inteface';
import moment from 'moment';

@Component({
    selector: 'app-invoice-pending',
    templateUrl: './invoice-pending.component.html',
    styleUrls: ['./invoice-pending.component.scss'],
})
export class InvoicePendingComponent {
    constructor(private store$: Store<DonateState>, private clipboard: Clipboard) {}

    public selectedPaymentMethodName$: Observable<string> = this.store$
        .select(selectSelectedPaymentMethodName)
        .pipe(filter((x) => !!x));

    public selectInvoice$ = this.store$.select(selectInvoice);
    public selectInvoiceStatus$ = this.store$.select(selectInvoiceStatus);
    public paymentMethods$ = this.store$.select(selectPaymentMethods);
    public isLoading$ = this.store$.select(selectIsLoading);

    public expiresIn = combineLatest([timer(0, 1000), this.selectInvoice$]).pipe(
        map(([, invoice]) => {
            const diff = invoice?.expirationTime - moment().unix();
            if (diff < 0) return '0:00';
            const time = moment.utc(diff * 1000).format('m:ss');
            return time;
        }),
    );

    public selectedPaymentMethod$: Observable<PaymentMethod> = this.store$.select(
        selectSelectedPaymentMethod,
    );

    public cancelInvoice() {
        this.store$.dispatch(cancelInvoice());
    }

    public updateSelectedPayment(paymentMethodName) {
        if (paymentMethodName?.value) {
            this.store$.dispatch(
                selectPaymentMethod({ paymentMethodName: paymentMethodName.value }),
            );
        }
    }

    public clickToCopy(value) {
        this.clipboard.copy(value);
    }
}
