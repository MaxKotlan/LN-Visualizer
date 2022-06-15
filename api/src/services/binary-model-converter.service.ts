import { injectable } from 'inversify';
import { GraphRegistryService } from './graph-registry.service';

@injectable()
export class BinaryModelConverter {
    constructor(private graphRegistryService: GraphRegistryService) {}

    private fromHexString = (hexString: string) => [
        parseInt(hexString[1] + hexString[2], 16),
        parseInt(hexString[3] + hexString[4], 16),
        parseInt(hexString[5] + hexString[6], 16),
    ];

    public header(a: number, b: number) {
        let headerBuf = new Uint8Array(4 * 3);
        headerBuf.set(new Uint32Array([0, a, b]));
        console.log(headerBuf);
        return headerBuf;
    }

    public getBinaryNodePosBuffer(): Uint8Array {
        let posBuf = new Float32Array(this.graphRegistryService.nodeMap.size);
        let colorBuf = new Uint8Array(this.graphRegistryService.nodeMap.size);
        this.graphRegistryService.nodeMap.forEach((m) => {
            posBuf[m['buffer_index'] * 3 + 0] = (m as any).position.x;
            posBuf[m['buffer_index'] * 3 + 1] = (m as any).position.y;
            posBuf[m['buffer_index'] * 3 + 2] = (m as any).position.z;
            const col = this.fromHexString(m.color);
            colorBuf[m['buffer_index'] * 3 + 0] = col[0];
            colorBuf[m['buffer_index'] * 3 + 1] = col[1];
            colorBuf[m['buffer_index'] * 3 + 2] = col[2];
        });
        const header = this.header(posBuf.buffer.byteLength, colorBuf.buffer.byteLength);
        const t: Uint8Array = new Uint8Array(
            header.buffer.byteLength + posBuf.buffer.byteLength + colorBuf.buffer.byteLength,
        );
        t.set(new Uint8Array(header.buffer));
        t.set(new Uint8Array(posBuf.buffer), header.buffer.byteLength);
        t.set(colorBuf, posBuf.buffer.byteLength + header.buffer.byteLength);
        return t;
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
