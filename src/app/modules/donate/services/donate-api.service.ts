import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LnVisInvoice } from '../models';

@Injectable({
    providedIn: 'root',
})
export class DonateApiService {
    constructor(private httpClient: HttpClient) {}

    public readonly baseUrl = 'http://umbrel.local:8551/createInvoice';

    public createInvoice(amount: number): Observable<LnVisInvoice> {
        const url = `${this.baseUrl}`;
        return this.httpClient.post(url, { amount }) as Observable<LnVisInvoice>;
    }
}
