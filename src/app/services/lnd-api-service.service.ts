import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { asyncScheduler, delay, filter, interval, map, Observable, throttleTime } from 'rxjs';
import { LnGraph } from '../types/graph.interface';
import { webSocket } from 'rxjs/webSocket';
import { Chunk, LndChannel, LndNode } from 'api/src/models';

@Injectable({
    providedIn: 'root',
})
export class LndApiServiceService {
    constructor(private http: HttpClient) {
        this.subject.next('initsync');
    }

    public subject = webSocket('wss://lnvisualizer.com/api/');

    public initialChunkSync(): Observable<Chunk<LndNode | LndChannel>> {
        this.subject.asObservable().pipe(map((chunk) => JSON.parse(chunk as string)));
        return this.subject as Observable<Chunk<LndNode>>;
    }
}
