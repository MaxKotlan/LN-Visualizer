import { injectable } from 'inversify';
import { BehaviorSubject, filter, share, take, takeUntil } from 'rxjs';
import WebSocket from 'ws';

type ServerStatus = 'retrieving data from lnd' | 'calculating positions' | 'ready to download';

@injectable()
export class ServerStatusService {
    constructor() {}

    private statusSubject: BehaviorSubject<ServerStatus> = new BehaviorSubject<ServerStatus>(
        'retrieving data from lnd',
    );

    public serverStatus$ = this.statusSubject.asObservable();
    public serverIsReady$ = this.serverStatus$.pipe(filter((x) => x === 'ready to download'));

    public startCalculatingPositions() {
        this.statusSubject.next('calculating positions');
    }

    public readyToDownload() {
        this.statusSubject.next('ready to download');
    }

    public sendStatus(ws: WebSocket, status: ServerStatus) {
        ws.send(JSON.stringify({ type: 'serverStatus', status }));
    }
}
