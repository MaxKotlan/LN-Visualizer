import { Injectable } from '@angular/core';
import { Chunk, LndChannel, LndNode } from 'api/src/models';
import { map, mergeMap, Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { ChunkSerializer } from './chunk-serializer.service';

@Injectable({
    providedIn: 'root',
})
export class LndApiServiceService {
    constructor(private chunkSerializer: ChunkSerializer) {}

    public initialChunkSync(): Observable<Chunk<LndNode | LndChannel>> {
        const subject = webSocket({
            url: 'ws://127.0.0.1:5647',
            deserializer: ({ data }) => {
                return data;
            },
        });
        return subject
            .asObservable()
            .pipe(
                mergeMap((blob: Blob) =>
                    blob
                        .arrayBuffer()
                        .then((buffer: ArrayBuffer) =>
                            this.chunkSerializer.deserialize(buffer as Buffer),
                        ),
                ),
            ) as Observable<Chunk<LndNode | LndChannel>>;
    }
}
