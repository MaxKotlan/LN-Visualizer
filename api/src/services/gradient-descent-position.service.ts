import { Vector3 } from 'three';
import { runInThisContext } from 'vm';
import { LndNode } from '../models';
import { GraphRegistryService } from './graph-registry.service';
import { PositionAlgorithm } from './position-algorithm';
import * as seedRandom from 'seedrandom';
import { performance } from 'perf_hooks';
import * as kdTree from 'kd-tree-javascript';

type NodePublicKey = string;

interface PosData {
    position: Vector3;
    delta: Vector3;
}

const distance = function (a, b) {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
};

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

    public getClosestPosition(pointToCheck: Vector3) {
        let minDist = Infinity;
        let point: Vector3 | undefined = undefined;
        this.posData.forEach((positionData, public_key) => {
            const dSquared = positionData.position.distanceToSquared(pointToCheck);
            if (dSquared < minDist) {
                minDist = dSquared;
                point = positionData.position;
            }
        });
        return point;
    }

    public buildKDTree() {
        const points: Array<Vector3> = [];
        this.posData.forEach((p) => {
            points.push(p.position);
        });
        return new kdTree.kdTree(points, distance, ['x', 'y', 'z']);
    }

    public epoch() {
        const closestPointBuffer: Map<NodePublicKey, Vector3> = new Map();
        const averageNeighborPositionBuffer: Map<NodePublicKey, Vector3> = new Map();
        const pointTree = this.buildKDTree();
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
            averageNeighborPositionBuffer.set(public_key, delta);
            //positionData.position
            // console.log(pointTree);
            const closestPoint = pointTree.nearest(positionData.position, 1)[0][0];
            if (closestPoint) {
                closestPointBuffer.set(public_key, closestPoint);
            }
            // console.log(posBuffer.get(public_key));
        });
        averageNeighborPositionBuffer.forEach((delta, key) => {
            const acnp = this.posData.get(key);
            const nearestNeighborPosition = closestPointBuffer.get(key);
            if (!acnp) throw new Error('this should not happen');
            if (!nearestNeighborPosition) throw new Error('this should not happen');
            // if (!nearestNeighborPosition) throw new Error('this should not happen');
            this.validateVector(delta);
            const d2 = delta;
            if (
                acnp.position.distanceTo(delta) > 0.1 //&&
                // averageConnectedNeighborPosition.position.distanceTo(new Vector3(0, 0, 0)) > 0.1
            ) {
                delta.add(nearestNeighborPosition);
                delta.sub(acnp.position);
                delta.multiplyScalar(this.learningRate);
                acnp.position = acnp.position.clone().add(delta);
            }
            this.validateVector(acnp.position);
            // c.position.set(pos.position.x, pos.position.y, pos.position.z);
            // c.delta.set(pos.delta.x, pos.delta.y, pos.delta.z);
        });
    }

    public calculatePositions() {
        this.initialize();
        const startTime = performance.now();
        for (let i = 0; i < this.epochs; i++) {
            this.epoch();
            if (i % 10 === 0) {
                console.log(`done with epoch ${i} ${performance.now() - startTime}`);
            }
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

    public getRandomVector(seed) {
        const rng = seedRandom.xor128(seed);
        const v = new Vector3(2.0 * (rng() - 0.5), 2.0 * (rng() - 0.5), 2.0 * (rng() - 0.5));
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
                position: this.getRandomVector(node1Pub),
                delta: new Vector3(0, 0, 0),
            });

            this.posData.set(node2Pub, {
                position: this.getRandomVector(node2Pub),
                delta: new Vector3(0, 0, 0),
            });
        });
    }
}
