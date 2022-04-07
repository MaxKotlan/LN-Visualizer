import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { LnVisInvoice } from '../models';

@Injectable({
    providedIn: 'root',
})
export class DonateApiService {
    constructor(private httpClient: HttpClient) {}

    public readonly baseUrl = 'http://127.0.0.1:8506/createInvoice';

    public createInvoice(amount: number): Observable<LnVisInvoice> {
        const url = `${this.baseUrl}`;
        return this.httpClient.post<LnVisInvoice>(url, { amount });
    }

    public subscribeToInvoiceUpdates(invoiceId: string): Observable<LnVisInvoice> {
        return webSocket(`ws://127.0.0.1:8506/ws/?invoiceId=${invoiceId}`)
            .asObservable()
            .pipe(tap(console.log));
    }
}
