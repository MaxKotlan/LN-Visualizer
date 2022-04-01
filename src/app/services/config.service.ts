import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    constructor(private httpClient: HttpClient) {}

    public origin$: Observable<string> = this.httpClient.get('assets/origin.txt', {
        responseType: 'text',
    });
}
