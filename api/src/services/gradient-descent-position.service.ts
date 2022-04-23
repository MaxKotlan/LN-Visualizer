import { Vector3 } from 'three';
import { runInThisContext } from 'vm';
import { LndNode } from '../models';
import { GraphRegistryService } from './graph-registry.service';
import { PositionAlgorithm } from './position-algorithm';

type NodePublicKey = string;

interface PosData {
    position: Vector3;
    delta: Vector3;
}

export class GradientDescentPositionAlgorithm extends PositionAlgorithm {
    public posData: Map<NodePublicKey, PosData> = new Map();
    public connectedNodes: Map<NodePublicKey, LndNode[]> = new Map();

    constructor(public graphRegistryService: GraphRegistryService) {
        super(graphRegistryService);
    }

    public epochs = 1024;
    public learningRate = 0.01;

    public validateVector(vec: Vector3) {
        if (!Number.isNaN(vec.x)) return;
        if (!Number.isNaN(vec.y)) return;
        if (!Number.isNaN(vec.z)) return;
        throw new Error('NAN Vector');
    }

    public epoch() {
        const deltaBuffer: Map<NodePublicKey, Vector3> = new Map();
        this.posData.forEach((positionData, public_key) => {
            const connectedNodes = this.connectedNodes.get(public_key);
            const delta = new Vector3(0, 0, 0);
            connectedNodes?.forEach((n) => {
                const position = this.posData.get(n.public_key);
                // if (position?.position.x) {
                if (position?.position) {
                    this.validateVector(position?.position);
                    delta.add(position?.position);
                }
                // } else
                //     throw new Error(
                //         'No pos data' +
                //             position?.position.x +
                //             position?.position.y +
                //             position?.position.z,
                //     );
            });
            if (connectedNodes?.length && connectedNodes?.length > 0)
                delta.divideScalar(connectedNodes.length);
            // else throw new Error('div zero');
            deltaBuffer.set(public_key, delta);
            // console.log(posBuffer.get(public_key));
        });
        deltaBuffer.forEach((delta, key) => {
            const c = this.posData.get(key);
            if (!c) throw new Error('this should not happen');
            this.validateVector(delta);
            if (
                c.position.distanceTo(delta) > 0.01 &&
                c.position.distanceTo(new Vector3(0, 0, 0)) > 0.01
            ) {
                delta.sub(c.position).multiplyScalar(this.learningRate);
                c.position = c.position.clone().add(delta);
            }
            this.validateVector(c.position);
            // c.position.set(pos.position.x, pos.position.y, pos.position.z);
            // c.delta.set(pos.delta.x, pos.delta.y, pos.delta.z);
        });
    }

    public calculatePositions() {
        this.initialize();
        for (let i = 0; i < this.epochs; i++) {
            this.epoch();
            if (i % 10 === 0) console.log(`done with epoch ${i}`);
        }
        this.save();
    }

    public save() {
        this.posData.forEach((pos, key) => {
            const n = this.graphRegistryService.nodeMap.get(key);
            if (n) n['position'] = pos.position;
        });
        let nocount = 0;
        this.graphRegistryService.nodeMap.forEach((c) => {
            if (!c['position']?.x) {
                nocount += 1;
                c['position'] = new Vector3(0, 0, 0);
            }
        });
        console.log('BAD NODES: ', nocount);
    }

    public getRandomVector() {
        const v = new Vector3(
            2.0 * (Math.random() - 0.5),
            2.0 * (Math.random() - 0.5),
            2.0 * (Math.random() - 0.5),
        );
        this.validateVector(v);
        return v;
    }

    public initialize() {
        this.graphRegistryService.channelMap.forEach((channel) => {
            const node1Pub = channel.policies[0].public_key;
            const node2Pub = channel.policies[1].public_key;

            const node1 = this.graphRegistryService.nodeMap.get(node1Pub);
            const node2 = this.graphRegistryService.nodeMap.get(node2Pub);

            // if (!node1) return;
            // if (!node2) return;

            if (!this.connectedNodes.has(node1Pub)) this.connectedNodes.set(node1Pub, []);

            if (!this.connectedNodes.has(node2Pub)) this.connectedNodes.set(node2Pub, []);

            if (node2) this.connectedNodes.get(node1Pub)?.push(node2);
            if (node1) this.connectedNodes.get(node2Pub)?.push(node1);

            this.posData.set(node1Pub, {
                position: this.getRandomVector(),
                delta: new Vector3(0, 0, 0),
            });

            this.posData.set(node2Pub, {
                position: this.getRandomVector(),
                delta: new Vector3(0, 0, 0),
            });
        });
    }
}
