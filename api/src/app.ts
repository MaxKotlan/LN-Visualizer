import { injectable } from 'inversify';
import 'reflect-metadata';
import { LndGraphStateService } from './services';

@injectable()
export class App {
    constructor(private graphStateService: LndGraphStateService) {}

    public init() {
        this.graphStateService.init();
    }
}
