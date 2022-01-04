import { injectable } from 'inversify';
import { WebSocketServer } from 'ws';
import { InitialSyncService } from './initial-sync.service';

@injectable()
export class WebSocketService {
    protected wss: WebSocketServer;

    constructor(private initialSyncService: InitialSyncService) {
        console.log('Initializing Websocket Server');
        this.wss = new WebSocketServer({ port: 8090 });
    }

    public init() {
        //const initsync = new InitialSyncService();
        this.wss.on(
            'connection',
            this.initialSyncService.performInitialSync.bind(this.initialSyncService),
        );
    }
}
