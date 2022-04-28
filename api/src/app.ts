import { injectable } from 'inversify';
import 'reflect-metadata';
import { LndGraphManagerService, WebSocketService } from './services';

@injectable()
export class App {
    constructor(
        private graphManagerService: LndGraphManagerService,
        private webSocketService: WebSocketService,
    ) {}

    public async init() {
        this.webSocketService.init();
        await this.graphManagerService.init();
    }
}
