import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    asyncScheduler,
    delay,
    filter,
    interval,
    map,
    Observable,
    switchMap,
    throttleTime,
} from 'rxjs';
import { LnGraph } from '../types/graph.interface';
import { webSocket } from 'rxjs/webSocket';
import { Chunk, LndChannel, LndNode } from 'api/src/models';
import { ChunkSerializer } from './chunk-serializer.service';

@Injectable({
    providedIn: 'root',
})
export class LndApiServiceService {
    constructor(private http: HttpClient, private chunkSerializer: ChunkSerializer) {}

    public initialChunkSync(): Observable<Chunk<LndNode | LndChannel>> {
        const subject = webSocket({
            url: 'ws://127.0.0.1:5647',
            deserializer: ({ data }) => {
                return data;
            },
        });
        return subject.asObservable().pipe(
            switchMap((blob: Blob) => blob.arrayBuffer()),
            map((buffer: ArrayBuffer) => {
                return this.chunkSerializer.deserialize(buffer as any);
            }),
        ) as Observable<Chunk<LndNode | LndChannel>>;
    }
}
