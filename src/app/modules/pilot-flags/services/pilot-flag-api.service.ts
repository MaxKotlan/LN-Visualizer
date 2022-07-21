import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PilotFlags } from '../reducer';

@Injectable({
    providedIn: 'root',
})
export class PilotFlagApiService {
    constructor(private http: HttpClient) {}

    public getApiConfig(): Observable<PilotFlags> {
        return this.http.get<PilotFlags>('/assets/pilots.json');
    }
}
