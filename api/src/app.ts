import { injectable } from 'inversify';
import 'reflect-metadata';
import { LndChunkTrackerService, LndGraphStateService, WebSocketService } from './services';

@injectable()
export class App {
    constructor(
        private graphStateService: LndGraphStateService,
        private webSocketService: WebSocketService,
        private lndChunkTrackerService: LndChunkTrackerService,
    ) {}

    public async init() {
        await this.graphStateService.init();
        this.listenForNewConnections();
    }

    public listenForNewConnections() {
        this.webSocketService.newConnection$.subscribe((ws) => {
            this.lndChunkTrackerService.nodeChunks.forEach((chunk) => {
                ws.send(chunk);
            });
        });
    }
}
