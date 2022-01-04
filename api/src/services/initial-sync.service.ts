import { injectable } from 'inversify';
import { WebSocket } from 'ws';
import { LndChunkTrackerService } from './lnd-chunk-tracker.service';

@injectable()
export class InitialSyncService {
    constructor(private lndChunkTrackerService: LndChunkTrackerService) {}

    public performInitialSync(ws: WebSocket) {
        this.lndChunkTrackerService.nodeChunks.forEach((chunk) => {
            ws.send(JSON.stringify(chunk));
        });
    }
}
