import { injectable } from 'inversify';
import { WebSocketServer } from 'ws';
import { ChannelCloseService } from './channel-close.service';
import { InitialSyncService } from './initial-sync.service';

@injectable()
export class WebSocketService {
    protected wss: WebSocketServer;

    constructor(
        private initialSyncService: InitialSyncService,
        private channelCloseService: ChannelCloseService,
    ) {
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

    public channelUpdated(channelId: string) {
        this.wss.clients.forEach((ws) =>
            this.channelCloseService.forwardChannelCloseEvent(ws, channelId),
        );
    }
}
