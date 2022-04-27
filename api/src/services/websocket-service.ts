import { injectable } from 'inversify';
import { WebSocketServer } from 'ws';
import { ChannelCloseService } from './channel-close.service';
import { ChannelUpdatedService } from './channel-updated.service';
import { ConfigService } from './config.service';
import { InitialSyncService } from './initial-sync.service';

@injectable()
export class WebSocketService {
    protected wss!: WebSocketServer;

    constructor(
        private initialSyncService: InitialSyncService,
        private channelCloseService: ChannelCloseService,
        private channelUpdatedService: ChannelUpdatedService,
        private configService: ConfigService,
    ) {
        this.initServer();
    }

    public initServer() {
        const host = this.configService.getConfig().host;
        const port = this.configService.getConfig().port;

        console.log(`Initializing Websocket Server on ws://${host}:${port}`);
        this.wss = new WebSocketServer({
            host: host,
            port: port,
        });
    }

    public init() {
        this.wss.on('connection', (ws, req) => {
            ws.on('message', (data) => {
                if (data.toString() === '"initsync"') {
                    console.log(
                        req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                        'requesting initsync',
                    );
                    this.initialSyncService.sendChunkInfo(ws);
                    this.initialSyncService.performInitialNodeSync(ws);
                    this.initialSyncService.performInitialChannelSync(ws);
                    this.initialSyncService.sendRequestComplete(ws);
                    ws.close();
                }
            });
        });
    }

    public channelClosed(channelId: string) {
        console.log(`Broadcasting channel ${channelId} closed to ${this.wss.clients.size} clients`);
        this.wss.clients.forEach((ws) =>
            this.channelCloseService.forwardChannelCloseEvent(ws, channelId),
        );
    }

    public channelUpdated(channelId: string) {
        console.log(
            `Broadcasting channel ${channelId} updated to ${this.wss.clients.size} clients`,
        );
        this.wss.clients.forEach((ws) =>
            this.channelUpdatedService.forwardChannelUpdatedEvent(ws, channelId),
        );
    }
}
