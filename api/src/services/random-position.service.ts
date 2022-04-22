import { injectable } from 'inversify';
import { Vector3 } from 'three';
import { GraphRegistryService } from './graph-registry.service';
import { PositionAlgorithm } from './position-algorithm';

@injectable()
export class RandomPositionAlgorithm extends PositionAlgorithm {
    constructor(public graphRegistryService: GraphRegistryService) {
        super(graphRegistryService);
    }

    public calculatePositions() {
        this.graphRegistryService.nodeMap.forEach(
            (n) => (n['position'] = new Vector3(Math.random(), Math.random(), Math.random())),
        );
    }
}
