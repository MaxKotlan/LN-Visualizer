import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { createInvoice } from '../../actions/donate.actions';
import { DonateState } from '../../reducers';
import { selectInvoice, selectIsLoading } from '../../selectors/donate.selectors';

@Component({
    selector: 'app-enter-invoice-amount',
    templateUrl: './enter-invoice-amount.component.html',
    styleUrls: ['./enter-invoice-amount.component.scss'],
})
export class EnterInvoiceAmountComponent {
    constructor(private store$: Store<DonateState>) {}

    public amount: number;
    public selectInvoice$ = this.store$.select(selectInvoice);
    public isLoading$ = this.store$.select(selectIsLoading);

    public getData() {
        this.store$.dispatch(createInvoice({ amount: this.amount }));
    }
}
