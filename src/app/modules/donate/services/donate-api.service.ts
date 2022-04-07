import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
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

    protected activeConnections: Map<string, WebSocketSubject<LnVisInvoice>> = new Map<
        string,
        WebSocketSubject<LnVisInvoice>
    >();

    public subscribeToInvoiceUpdates(invoiceId: string): Observable<LnVisInvoice> {
        const url = `wss://lnvisualizer.com/donate/ws/?invoiceId=${invoiceId}`;
        if (!this.activeConnections.has(invoiceId))
            this.activeConnections.set(invoiceId, webSocket(url));

        console.log('Attempting to connect to ', url);
        const ws = this.activeConnections.get(invoiceId).asObservable();
        console.log('ws', ws);
        return ws;
    }

    public unsubscribeFromUpdates(invoiceId: string) {
        this.activeConnections.get(invoiceId)?.complete();
    }
}
