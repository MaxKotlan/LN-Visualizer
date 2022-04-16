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
        await this.graphManagerService.init();
        this.webSocketService.init();
    }
}
