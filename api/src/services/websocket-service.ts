import { injectable } from 'inversify';
import { fromEvent, Observable } from 'rxjs';
import { WebSocket, WebSocketServer } from 'ws';

@injectable()
export class WebSocketService {
    protected wss: WebSocketServer;

    public newConnection$: Observable<WebSocket>;

    constructor() {
        this.wss = new WebSocketServer({ port: 8090 });
        this.newConnection$ = fromEvent(this.wss, 'connection') as Observable<WebSocket>;
    }
}
