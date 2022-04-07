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

    public readonly baseUrl = 'https://lnvisualizer.com/donate/createInvoice';

    public createInvoice(amount: number): Observable<LnVisInvoice> {
        const url = `${this.baseUrl}`;
        return this.httpClient.post<LnVisInvoice>(url, { amount });
    }

    public subscribeToInvoiceUpdates(invoiceId: string): Observable<LnVisInvoice> {
        const url = `wss://lnvisualizer.com/donate/ws/?invoiceId=${invoiceId}`;
        return webSocket(url).asObservable().pipe(tap(console.log));
    }
}
