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
        this.wss.on(
            'connection',
            this.initialSyncService.performInitialNodeSync.bind(this.initialSyncService),
        );
        this.wss.on(
            'connection',
            this.initialSyncService.performInitialChannelSync.bind(this.initialSyncService),
        );
    }
}
