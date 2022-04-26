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

    public calculateAverageConnectedNeighbors(public_key: string): Vector3 {
        const delta = new Vector3(0, 0, 0);
        const connectedNodes = this.connectedNodes.get(public_key);
        connectedNodes?.forEach((n) => {
            const position = this.posData.get(n.public_key);
            if (position?.position) {
                this.validateVector(position?.position);
                delta.add(position?.position);
            }
        });
        if (connectedNodes?.length && connectedNodes?.length > 0)
            delta.divideScalar(connectedNodes.length);
        return delta;
    }

    public calculateNewPositions() {
        this.posData.forEach((positionData, public_key) => {
            const aveargeNeighborPosition = this.calculateAverageConnectedNeighbors(public_key);
            this.averageNeighborPositionBuffer.set(public_key, aveargeNeighborPosition);
            const closestPoint = this.pointTree.nearest(
                [positionData.position.x, positionData.position.y, positionData.position.z],
                2,
            )[0][0] as Array<number>;
            this.closestPointBuffer.set(
                public_key,
                new Vector3(closestPoint[0], closestPoint[1], closestPoint[2]),
            );
        });
    }

    public applyNewPositions() {
        this.posData.forEach((currentNodePos, key) => {
            const averageNeightborPosition = this.averageNeighborPositionBuffer.get(key);
            const closestPoint = this.closestPointBuffer.get(key);
            let connectedNodesLength = 0;
            if (this.connectedNodes.get(key)?.length === undefined) connectedNodesLength = 0.0;
            else
                connectedNodesLength = (this.connectedNodes.get(key) as Array<any>)
                    .length as number;

            if (!averageNeightborPosition) throw new Error('this should not happen');
            if (!closestPoint) throw new Error('this should not happen');
            if (connectedNodesLength === undefined) throw new Error('this should not happen');
            this.validateVector(averageNeightborPosition);
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
            positiveDelta.add(negativeDelta);
            positiveDelta.divideScalar(2);
            positiveDelta.multiplyScalar(this.learningRate);
            currentNodePos.position.add(positiveDelta);
            this.validateVector(currentNodePos.position);
        });
    }

    public pointTree: any;
    public closestPointBuffer: Map<NodePublicKey, Vector3> = new Map();
    public averageNeighborPositionBuffer: Map<NodePublicKey, Vector3> = new Map();

    public resetData() {
        this.closestPointBuffer.clear();
        this.averageNeighborPositionBuffer.clear();
        this.pointTree = this.buildKDTree();
    }

    public epoch() {
        this.resetData();
        this.calculateNewPositions();
        this.applyNewPositions();
    }

    public computePositiveDelta(
        currentNodePos: Vector3,
        averageNeightborPosition: Vector3,
        connectedNodesLength: number,
    ) {
        if (
            currentNodePos.distanceTo(averageNeightborPosition) >
            (1 - Math.log(connectedNodesLength + 1) / Math.log(3143 + 1)) * 0.1 //&&
            // currentNodePos.distanceTo(new Vector3(0, 0, 0)) > 0.1
        ) {
            const a = averageNeightborPosition.clone().sub(currentNodePos);
            const h = Math.log(connectedNodesLength + 1) / Math.log(3143 + 1);
            const b = new Vector3(0, 0, 0).sub(currentNodePos).multiplyScalar(h);
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
                .divideScalar(Math.log(d + 1) + 1)
                .multiplyScalar(1.0); //.divideScalar(d + 1);

            const j = new Vector3(0, 0, 0).sub(currentNodePos);

            const factor = Math.log(connectedNodesLength + 1) / Math.log(3143 + 1) - 1;

            const l = j.multiplyScalar(factor * 0.025);

            h.add(l);
            h.divideScalar(2);

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