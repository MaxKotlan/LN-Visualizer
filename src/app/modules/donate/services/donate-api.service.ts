import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '../components/models';
import { PaymentMethod } from '../components/models/payment-methods.interface';

@Injectable({
    providedIn: 'root',
})
export class DonateApiService {
    constructor(private httpClient: HttpClient) {}

    public readonly baseUrl = 'https://lnvisualizer.com/donate/';

    public createBody(amount: number) {
        return {
            metadata: {
                orderId: 'donate',
                orderUrl: '',
            },
            amount,
            currency: 'SATS',
        };
    }

    public createInvoice(amount: number): Observable<Invoice> {
        const url = `${this.baseUrl}`;
        return this.httpClient.post(url, this.createBody(amount)) as Observable<Invoice>;
    }

    public getPaymentMethods(invoiceId: string): Observable<PaymentMethod[]> {
        const url = `${this.baseUrl}${invoiceId}/payment-methods`;
        return this.httpClient.get(url) as Observable<PaymentMethod[]>;
    }
}
