import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Chunk, LndChannel, LndNode } from 'api/src/models';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { initializeGraphSyncProcess } from '../../graph-renderer/actions';

@Injectable()
export class InitialSyncApiService {
    private subject: WebSocketSubject<Chunk<LndNode | LndChannel>>;

    public createWsSubject() {
        if (environment.production) {
            this.subject = webSocket(
                `${location.origin.replace('http://', 'ws://').replace('https://', 'wss://')}/api/`,
            );
        } else {
            this.subject = webSocket(`wss://lnvisualizer.com/api/`);
        }
    }

    public sendSyncCommand() {
        this.createWsSubject();
        console.log('lol');
        this.subject.next('initsync' as unknown as Chunk<LndNode | LndChannel>);
    }

    public completeRequest() {
        this.subject.complete();
    }

    public listenToStream(): Observable<Chunk<LndNode | LndChannel>> {
        return this.subject.asObservable();
    }
}
