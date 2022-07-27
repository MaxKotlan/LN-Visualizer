import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DonateState } from '../../reducers';
import { paymentSettled } from '../../selectors/donate.selectors';

@Component({
    selector: 'app-donate-modal',
    templateUrl: './donate-modal.component.html',
    styleUrls: ['./donate-modal.component.scss'],
})
export class DonateModalComponent {
    constructor(private store$: Store<DonateState>) {}

    public paymentIsSettled$ = this.store$.select(paymentSettled);
}
