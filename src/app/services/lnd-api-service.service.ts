import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Chunk, LndChannel, LndNode } from 'api/src/models';
import { map, Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { initializeGraphSyncProcess } from '../modules/graph-renderer/actions';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root',
})
export class LndApiServiceService {
    public subject: WebSocketSubject<unknown>;
    constructor(private configService: ConfigService, private store$: Store<any>) {
        this.configService.origin$.subscribe((origin) => {
            this.subject = webSocket(origin);
            this.subject.next('initsync');
            this.store$.dispatch(initializeGraphSyncProcess());
        });
    }

    public initialChunkSync(): Observable<Chunk<LndNode | LndChannel>> {
        this.subject.asObservable().pipe(map((chunk) => JSON.parse(chunk as string)));
        return this.subject as Observable<Chunk<LndNode>>;
    }
}
