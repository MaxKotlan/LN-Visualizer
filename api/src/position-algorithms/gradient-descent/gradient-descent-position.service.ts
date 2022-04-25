import { Vector3 } from 'three';
import { runInThisContext } from 'vm';
import { LndNode } from '../../models';
import { GraphRegistryService } from '../../services/graph-registry.service';
import { PositionAlgorithm } from '../position-algorithm';
import * as seedRandom from 'seedrandom';
import { performance } from 'perf_hooks';
import * as kdTree from 'kd-tree-javascript';

type NodePublicKey = string;

interface PosData {
    position: Vector3;
    delta: Vector3;
}

const tempA = new Vector3(0, 0, 0);
const tempB = new Vector3(0, 0, 0);

const distance = (a: Array<number>, b: Array<number>) => {
    tempA.set(a[0], a[1], a[2]);
    tempB.set(b[0], b[1], b[2]);
    return tempA.distanceTo(tempB);
};

export class GradientDescentPositionAlgorithm extends PositionAlgorithm {
    public posData: Map<NodePublicKey, PosData> = new Map();
    public connectedNodes: Map<NodePublicKey, LndNode[]> = new Map();

    constructor(public graphRegistryService: GraphRegistryService) {
        super(graphRegistryService);
    }

    public epochs = 1024;
    public learningRate = 0.03;

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
        const points = Array.from(this.posData.entries()).map(([key, pos]) => [
            pos.position.x,
            pos.position.y,
            pos.position.z,
            key,
        ]);
        return new kdTree.kdTree(points, distance, ['0', '1', '2']);
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
            const closestPoint = pointTree.nearest(
                [positionData.position.x, positionData.position.y, positionData.position.z],
                2,
            )[0][0];
            if (closestPoint) {
                // console.log('checking for', public_key);
                // console.log(closestPoint);
                closestPointBuffer.set(
                    public_key,
                    new Vector3(closestPoint[0], closestPoint[1], closestPoint[2]),
                );
            }
            // console.log(posBuffer.get(public_key));
        });
        this.posData.forEach((currentNodePos, key) => {
            const averageNeightborPosition = averageNeighborPositionBuffer.get(key);
            const closestPoint = closestPointBuffer.get(key);
            const connectedNodesLength = this.connectedNodes.get(key)?.length || 1.0;

            if (!averageNeightborPosition) throw new Error('this should not happen');
            if (!closestPoint) throw new Error('this should not happen');
            if (!connectedNodesLength) throw new Error('this should not happen');
            this.validateVector(averageNeightborPosition);
            // if (
            //     currentNodePos.position.distanceTo(averageNeightborPosition) > 0.1 &&
            //     currentNodePos.position.distanceTo(new Vector3(0, 0, 0)) > 0.1
            // ) {
            //     averageNeightborPosition.sub(currentNodePos.position);
            //     averageNeightborPosition.multiplyScalar(this.learningRate);
            //     currentNodePos.position = currentNodePos.position
            //         .clone()
            //         .add(averageNeightborPosition);
            // }
            const positiveDelta = this.computePositiveDelta(
                currentNodePos.position,
                averageNeightborPosition,
                connectedNodesLength,
            );
            const negativeDelta = this.computeNegativeDelta(
                currentNodePos.position,
                closestPoint,
                connectedNodesLength,
            );
            // const negativeDelta = this.computeNegativeDelta(positiveDelta, closestPoint);
            // positiveDelta.normalize();
            // negativeDelta;//.multiplyScalar(0.01);

            //positiveDelta.sub(negativeDelta);
            // positiveDelta.add(negativeDelta);
            // positiveDelta.multiplyScalar(1 / 2);
            // if (!!negativeDelta.x || !!negativeDelta.y || !!negativeDelta.z)
            //     console.log('pos', positiveDelta, 'neg', negativeDelta, 'cpoint', closestPoint);
            positiveDelta.add(negativeDelta);
            positiveDelta.divideScalar(2);
            positiveDelta.multiplyScalar(this.learningRate);
            // console.log(negativeDelta);
            // this.validateVector(negativeDelta);
            currentNodePos.position.add(positiveDelta);
            this.validateVector(currentNodePos.position);
            // c.position.set(pos.position.x, pos.position.y, pos.position.z);
            // c.delta.set(pos.delta.x, pos.delta.y, pos.delta.z);
        });
        // closestPointBuffer.forEach((closestPosition, key) => {
        //     const currentNodePos = this.posData.get(key);
        //     if (!currentNodePos) throw new Error('this should not happen');
        //     this.validateVector(closestPosition);
        //     if (
        //         currentNodePos.position.distanceTo(closestPosition) < 0.1 &&
        //         currentNodePos.position.distanceTo(new Vector3(0, 0, 0)) < 2.0
        //     ) {
        //         closestPosition.sub(currentNodePos.position);
        //         closestPosition.multiplyScalar(this.learningRate);
        //         currentNodePos.position = currentNodePos.position.clone().sub(closestPosition);
        //     }
        //     this.validateVector(currentNodePos.position);
        // });
    }

    public computePositiveDelta(
        currentNodePos: Vector3,
        averageNeightborPosition: Vector3,
        connectedNodesLength: number,
    ) {
        if (
            currentNodePos.distanceTo(averageNeightborPosition) > 0.1 //&&
            // currentNodePos.distanceTo(new Vector3(0, 0, 0)) > 0.1
        ) {
            const a = averageNeightborPosition.clone().sub(currentNodePos);
            const b = new Vector3(0, 0, 0)
                .sub(currentNodePos)
                .multiplyScalar(connectedNodesLength / 3143);
            a.add(b);
            a.divideScalar(2);
            return a;
        }

        // const b = a.sub(new Vector3(0, 0, 0)).multiplyScalar(0.01);
        // return b;
        // averageNeightborPosition.multiplyScalar(this.learningRate);
        // return currentNodePos.clone().add(averageNeightborPosition);
        //   }
        return new Vector3(0, 0, 0);
    }

    public computeNegativeDelta(
        currentNodePos: Vector3,
        closestPoint: Vector3,
        connectedNodesLength: number,
    ) {
        const d = currentNodePos.distanceTo(closestPoint);
        if (currentNodePos.distanceTo(new Vector3(0, 0, 0)) < 1) {
            const h = currentNodePos
                .clone()
                .sub(closestPoint)
                .divideScalar(d + 1)
                .multiplyScalar(15.0); //.divideScalar(d + 1);

            const j = new Vector3(0, 0, 0).sub(currentNodePos);

            const factor = connectedNodesLength / 3143 - 1;

            const l = j.multiplyScalar(factor * 0.025);

            if (j.length() < 2) {
                h.add(l);
                h.divideScalar(2);
            }

            return j;
        }
        return new Vector3(0, 0, 0);

        // .clone()
        // .sub(currentNodePos)
        // .multiplyScalar(-0.1 / (d + 0.1));
        // .multiplyScalar(1 / (d + 1));
        // }
        // return new Vector3(0, 0, 0);
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
