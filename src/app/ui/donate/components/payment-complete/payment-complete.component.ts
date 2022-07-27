import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { cancelInvoice } from '../../actions/donate.actions';
import { DonateState } from '../../reducers';

@Component({
    selector: 'app-payment-complete',
    templateUrl: './payment-complete.component.html',
    styleUrls: ['./payment-complete.component.scss'],
})
export class PaymentCompleteComponent implements OnDestroy {
    constructor(private store$: Store<DonateState>) {}

    ngOnDestroy(): void {
        this.store$.dispatch(cancelInvoice());
    }
}
