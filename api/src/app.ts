import { injectable } from 'inversify';
import 'reflect-metadata';
import { LndGraphStateService, WebSocketService } from './services';

@injectable()
export class App {
    constructor(
        private graphStateService: LndGraphStateService,
        private webSocketService: WebSocketService,
    ) {}

    public async init() {
        await this.graphStateService.init();
        this.webSocketService.init();
    }
}
