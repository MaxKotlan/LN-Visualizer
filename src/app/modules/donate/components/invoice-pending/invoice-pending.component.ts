import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { cancelInvoice, selectPaymentMethod } from '../../actions/donate.actions';
import { DonateState } from '../../reducers';
import {
    selectInvoice,
    selectIsLoading,
    selectPaymentMethods,
    selectSelectedPaymentMethod,
    selectSelectedPaymentMethodName,
} from '../../selectors/donate.selectors';
import { Clipboard } from '@angular/cdk/clipboard';
import { filter, Observable } from 'rxjs';
import { PaymentMethod } from '../../models/payment-methods.inteface';

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
    public paymentMethods$ = this.store$.select(selectPaymentMethods);
    public isLoading$ = this.store$.select(selectIsLoading);

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
