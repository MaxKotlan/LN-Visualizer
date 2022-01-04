import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, map, Observable } from 'rxjs';
import { LnGraph } from '../types/graph.interface';
import { webSocket } from 'rxjs/webSocket';
import { LndNode } from 'api/src/models';

@Injectable({
    providedIn: 'root',
})
export class LndApiServiceService {
    constructor(private http: HttpClient) {}

    public getNetworkInfo(): Observable<any> {
        // const headers: HttpHeaders = new HttpHeaders({'Grpc-Metadata-macaroon': macaroon});

        return this.http.get('http://umbrel.local:5647/');
    }

    public getGraphInfo(): Observable<LnGraph> {
        //return this.http.get<LnGraph>('assets/graph-min.json');
        return this.http.get<LnGraph>('http://umbrel.local:5647/');
    }

    public initialChunkSync(): Observable<any> {
        const subject = webSocket('ws://127.0.0.1:8090');
        subject.asObservable().pipe(map((chunk) => JSON.parse(chunk as string)));
        return subject as Observable<any>;
    }
}
