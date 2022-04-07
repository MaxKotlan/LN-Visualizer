import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DonateState } from '../../reducers';
import { selectInvoiceError } from '../../selectors/donate.selectors';

@Component({
    selector: 'app-invoice-error',
    templateUrl: './invoice-error.component.html',
    styleUrls: ['./invoice-error.component.scss'],
})
export class InvoiceErrorComponent {
    constructor(private store$: Store<DonateState>) {}

    public error$: Observable<HttpErrorResponse> = this.store$.select(selectInvoiceError);
}
