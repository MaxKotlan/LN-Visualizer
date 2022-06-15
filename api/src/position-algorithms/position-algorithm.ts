import { injectable } from 'inversify';
import { Vector3 } from 'three';
import { GraphRegistryService } from '../services/graph-registry.service';

type NodePublicKey = string;
@injectable()
export abstract class PositionAlgorithm {
    public positionRegistry: Map<NodePublicKey, Vector3> = new Map();

    constructor(public graphRegistryService: GraphRegistryService) {}

    public abstract calculatePositions();

    public updateNodePositions() {
        let bufferIndex = 0;
        this.graphRegistryService.nodeMap.forEach((n) => {
            n['buffer_index'] = bufferIndex;
            n['position'] = this.positionRegistry[n.public_key];
            bufferIndex++;
        });
    }
}
