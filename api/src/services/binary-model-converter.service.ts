import { injectable } from 'inversify';
import { GraphRegistryService } from './graph-registry.service';

@injectable()
export class BinaryModelConverter {
    constructor(private graphRegistryService: GraphRegistryService) {}

    public getBinaryNodePosBuffer(): Float32Array {
        let buff = new Float32Array(this.graphRegistryService.nodeMap.size);
        this.graphRegistryService.nodeMap.forEach((m) => {
            buff[m['buffer_index'] * 3 + 0] = (m as any).position.x;
            buff[m['buffer_index'] * 3 + 1] = (m as any).position.y;
            buff[m['buffer_index'] * 3 + 2] = (m as any).position.z;
        });
        return buff;
    }

    public getBinaryChannelBuffer(): Float32Array {
        let buff = new Float32Array(this.graphRegistryService.channelMap.size * 2);
        let cindex = 0;
        //need to account for nodes not rendered
        this.graphRegistryService.channelMap.forEach((c) => {
            const nodeA = this.graphRegistryService.nodeMap.get(c.policies[0].public_key);
            const nodeB = this.graphRegistryService.nodeMap.get(c.policies[1].public_key);

            if (nodeA && nodeB) {
                const nindxA = nodeA['buffer_index'];
                const nindxB = nodeB['buffer_index'];
                buff[cindex * 2 + 0] = nindxA;
                buff[cindex * 2 + 1] = nindxB;
                cindex++;
            }
        });
        return buff.subarray(0, cindex * 2);
    }
}
