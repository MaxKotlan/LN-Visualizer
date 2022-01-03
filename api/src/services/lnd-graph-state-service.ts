import { injectable } from 'inversify';
import { LndAuthService } from './lnd-auth-service';

@injectable()
export class LndGraphStateService {
    constructor(private lndAuthService: LndAuthService) {}

    public init() {
        console.log('Graph State Service');
    }
}
