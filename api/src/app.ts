import { injectable } from 'inversify';
import 'reflect-metadata';
import { LndAuthService } from './services';

@injectable()
export class App {
    constructor(private config: LndAuthService) {}

    public init() {
        console.log('Starting LndVisualizer API');
        console.log('Config is: ', this.config.authenticatedLnd);
    }
}
