import { injectable } from 'inversify';
import { LndAuthService } from './lnd-auth-service';

@injectable()
export class LndGraphStateService {
    constructor(private lndAuthService: LndAuthService) {
        console.log('Config in sate service', this.lndAuthService.authenticatedLnd);
    }
}
