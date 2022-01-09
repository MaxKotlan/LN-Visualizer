import { injectable } from 'inversify';
import { WebSocketServer } from 'ws';
import { InitialSyncService } from './initial-sync.service';

@injectable()
export class WebSocketService {
    protected wss: WebSocketServer;

    constructor(private initialSyncService: InitialSyncService) {
        console.log('Initializing Websocket Server');
        this.wss = new WebSocketServer({ port: 5647 });
    }

    public init() {
        this.wss.on('connection', (ws) => {
            this.initialSyncService.sendChunkInfo(ws);
            this.initialSyncService.performInitialNodeSync(ws);
            this.initialSyncService.performInitialChannelSync(ws);
        });
    }
}
