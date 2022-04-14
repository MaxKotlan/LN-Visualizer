import { injectable } from 'inversify/lib/annotation/injectable';
import { GetNetworkGraphResult } from 'lightning';

@injectable()
export class GraphRegistryService {
    public graphState: GetNetworkGraphResult | undefined;
}
