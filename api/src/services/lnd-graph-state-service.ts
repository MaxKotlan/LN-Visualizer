import { injectable } from 'inversify';
import { LndAuthService } from './lnd-auth-service';
import * as lightning from 'lightning';
import { fromEvent } from 'rxjs';
@injectable()
export class LndGraphStateService {
    constructor(private lndAuthService: LndAuthService) {}

    public init() {
        const graphEvents = lightning.subscribeToGraph(this.lndAuthService.authenticatedLnd);
        console.log('subscribing to events');
        fromEvent(graphEvents, 'node_updated').subscribe((update) => {
            console.log(update);
        });
        fromEvent(graphEvents, 'channel_updated').subscribe((update) => {
            console.log(update);
        });
    }
}
