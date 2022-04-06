import { Clipboard } from '@angular/cdk/clipboard';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Observable } from 'rxjs';
import { cancelInvoice, createInvoice, selectPaymentMethod } from '../../actions/donate.actions';
import { PaymentMethod } from '../../models';
import { DonateState } from '../../reducers';
import {
    selectInvoice,
    selectInvoiceError,
    selectIsLoading,
    selectPaymentMethods,
    selectSelectedPaymentMethod,
    selectSelectedPaymentMethodName,
} from '../../selectors/donate.selectors';
import { DonateApiService } from '../../services/donate-api.service';

@Component({
    selector: 'app-donate-modal',
    templateUrl: './donate-modal.component.html',
    styleUrls: ['./donate-modal.component.scss'],
})
export class DonateModalComponent {
    constructor(
        public donateApiService: DonateApiService,
        private store$: Store<DonateState>,
        private clipboard: Clipboard,
    ) {}

    public isLoading$ = this.store$.select(selectIsLoading);
    public paymentMethods$ = this.store$.select(selectPaymentMethods);
    public selectInvoice$ = this.store$.select(selectInvoice);

    public amount: number;

    public error$: Observable<HttpErrorResponse> = this.store$.select(selectInvoiceError);

    public selectedPaymentMethodName$: Observable<string> = this.store$
        .select(selectSelectedPaymentMethodName)
        .pipe(filter((x) => !!x));

    public selectedPaymentMethod$: Observable<PaymentMethod> = this.store$.select(
        selectSelectedPaymentMethod,
    );

    public getData() {
        this.store$.dispatch(createInvoice({ amount: this.amount }));
    }

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
