import { injectable } from 'inversify';
import { lastValueFrom, take } from 'rxjs';
import { WebSocketServer } from 'ws';
import { BinaryModelConverter } from './binary-model-converter.service';
import { ConfigService } from './config.service';
import { InitialSyncService } from './initial-sync.service';
import { ServerStatusService } from './server-status.service';

@injectable()
export class WebSocketService {
    protected wss!: WebSocketServer;

    constructor(
        private initialSyncService: InitialSyncService,
        // private channelCloseService: ChannelCloseService,
        // private channelUpdatedService: ChannelUpdatedService,
        private configService: ConfigService,
        private serverStatusService: ServerStatusService,
        private binaryModelConverter: BinaryModelConverter,
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
            const status = this.serverStatusService.serverStatus$.subscribe((status) => {
                this.serverStatusService.sendStatus(ws, status);
            });
            ws.on('close', () => {
                status.unsubscribe();
            });
            ws.on('message', async (data) => {
                if (data.toString() === '"initsync"') {
                    console.log(
                        req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                        'requesting initsync',
                    );
                    await lastValueFrom(this.serverStatusService.serverIsReady$.pipe(take(1)));
                    this.initialSyncService.sendChunkInfo(ws);
                    this.initialSyncService.performInitialNodeSync(ws);
                    this.initialSyncService.performInitialChannelSync(ws);
                    this.initialSyncService.sendRequestComplete(ws);
                    ws.close();
                }
                if (data.toString() === '"binNodePos"') {
                    console.log(
                        req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                        'requesting binNodePos',
                    );
                    await lastValueFrom(this.serverStatusService.serverIsReady$.pipe(take(1)));
                    ws.send(this.binaryModelConverter.getBinaryNodePosBuffer());
                    ws.close();
                }
                if (data.toString() === '"binChannelPos"') {
                    console.log(
                        req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                        'requesting binChannelPos',
                    );
                    await lastValueFrom(this.serverStatusService.serverIsReady$.pipe(take(1)));
                    ws.send(this.binaryModelConverter.getBinaryChannelBuffer());
                    ws.close();
                }
            });
        });
    }

    // public channelClosed(channelId: string) {
    //     console.log(`Broadcasting channel ${channelId} closed to ${this.wss.clients.size} clients`);
    //     this.wss.clients.forEach((ws) =>
    //         this.channelCloseService.forwardChannelCloseEvent(ws, channelId),
    //     );
    // }

    // public channelUpdated(channelId: string) {
    //     console.log(
    //         `Broadcasting channel ${channelId} updated to ${this.wss.clients.size} clients`,
    //     );
    //     this.wss.clients.forEach((ws) =>
    //         this.channelUpdatedService.forwardChannelUpdatedEvent(ws, channelId),
    //     );
    // }
}
