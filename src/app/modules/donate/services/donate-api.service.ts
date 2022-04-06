import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LnVisInvoice } from '../models';

@Injectable({
    providedIn: 'root',
})
export class DonateApiService {
    constructor(private httpClient: HttpClient) {}

    public readonly baseUrl = 'http://127.0.0.1:8506/createInvoice';

    public createInvoice(amount: number): Observable<LnVisInvoice> {
        const url = `${this.baseUrl}`;
        return this.httpClient.post(url, { amount }) as Observable<LnVisInvoice>;
    }
}
