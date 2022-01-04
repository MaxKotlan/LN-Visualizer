import { injectable } from 'inversify';
import 'reflect-metadata';
import { LndGraphStateService } from './services';

@injectable()
export class App {
    constructor(private graphStateService: LndGraphStateService) {}

    public async init() {
        await this.graphStateService.init();
    }
}
