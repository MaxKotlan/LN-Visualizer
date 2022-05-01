import { Vector3 } from 'three';
import { LndNode } from '../../models';
import { GraphRegistryService } from '../../services/graph-registry.service';
import { PositionAlgorithm } from '../position-algorithm';
import * as seedRandom from 'seedrandom';
import { performance } from 'perf_hooks';
import * as kdTree from 'kd-tree-javascript';
import { ConfigService } from '../../services/config.service';
import { injectable } from 'inversify';

type NodePublicKey = string;

const tempA = new Vector3(0, 0, 0);
const tempB = new Vector3(0, 0, 0);

const distance = (a: Array<number>, b: Array<number>) => {
    tempA.set(a[0], a[1], a[2]);
    tempB.set(b[0], b[1], b[2]);
    return tempA.distanceTo(tempB);
};

@injectable()
export class GradientDescentPositionAlgorithm extends PositionAlgorithm {
    public posData: Map<NodePublicKey, Vector3> = new Map();
    public connectedNodes: Map<NodePublicKey, LndNode[]> = new Map();

    constructor(
        public graphRegistryService: GraphRegistryService,
        public configService: ConfigService,
    ) {
        super(graphRegistryService);
    }

    public iterations = this.configService.getConfig().gradientDescentSettings.iterations;
    public learningRate = this.configService.getConfig().gradientDescentSettings.learningRate;
    public maxConnectedNodeDistance =
        this.configService.getConfig().gradientDescentSettings.maxConnectedNodeDistance;
    public minConnectedNodeDistance =
        this.configService.getConfig().gradientDescentSettings.minConnectedNodeDistance;
    public connecteNodeDistanceRange =
        this.maxConnectedNodeDistance - this.minConnectedNodeDistance;
    public invertConnectedRange =
        this.configService.getConfig().gradientDescentSettings.invertConnectedRange;
    // public randomnessFactor = 0.1;

    public buildKDTree() {
        const points = Array.from(this.posData.entries()).map(([key, pos]) => [
            pos.x,
            pos.y,
            pos.z,
            key,
        ]);
        return new kdTree.kdTree(points, distance, ['0', '1', '2']);
    }

    public calculateAverageConnectedNeighbors(public_key: string): Vector3 {
        const delta = new Vector3(0, 0, 0);
        const connectedNodes = this.connectedNodes.get(public_key);
        connectedNodes?.forEach((n) => {
            const neighbor = this.posData.get(n.public_key);
            if (!neighbor) throw new Error('Could not retrieve connected neighbors');
            delta.add(neighbor);
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
                [positionData.x, positionData.y, positionData.z],
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
            const positiveDelta = this.computePositiveDelta(
                currentNodePos,
                averageNeightborPosition,
                connectedNodesLength,
            );
            const negativeDelta = this.computeNegativeDelta(
                currentNodePos,
                closestPoint,
                connectedNodesLength,
            );
            positiveDelta.add(negativeDelta);
            positiveDelta.divideScalar(2);
            positiveDelta.multiplyScalar(this.learningRate);
            currentNodePos.add(positiveDelta);
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

    public iteration() {
        this.resetData();
        this.calculateNewPositions();
        this.applyNewPositions();
    }

    public getCutoffDistance(connectedNodesLength) {
        const directionFactor = this.invertConnectedRange ? 1 : 0;
        return (
            (directionFactor -
                Math.log(connectedNodesLength + 1) / Math.log(this.maxNeighborCount + 1)) *
                this.connecteNodeDistanceRange +
            this.minConnectedNodeDistance
        );
    }

    public computePositiveDelta(
        currentNodePos: Vector3,
        averageNeightborPosition: Vector3,
        connectedNodesLength: number,
    ) {
        if (
            currentNodePos.distanceTo(averageNeightborPosition) >
            this.getCutoffDistance(connectedNodesLength)
        ) {
            const a = averageNeightborPosition.clone().sub(currentNodePos);
            const h = Math.log(connectedNodesLength + 1) / Math.log(this.maxNeighborCount + 1);
            const b = new Vector3(0, 0, 0).sub(currentNodePos).multiplyScalar(h);
            a.add(b);
            a.divideScalar(2);
            return a;
        }
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
                // .divideScalar(16 * Math.log(d + 1) + 1)
                .multiplyScalar(-1 * d + 1)
                .multiplyScalar(1.0);

            const j = new Vector3(0, 0, 0).sub(currentNodePos);

            const factor = connectedNodesLength / this.maxNeighborCount; // Math.log(connectedNodesLength + 1) / Math.log(this.maxNeighborCount + 1);

            const l = j.multiplyScalar(factor * 0.025);

            const r = new Vector3(0, 0, 0).sub(l);

            h.add(r);
            h.divideScalar(2);

            return j;
        }
        return new Vector3(0, 0, 0);
    }

    public calculatePositions() {
        this.initialize();
        const startTime = performance.now();
        let iterationTime: number | undefined = undefined;
        for (let i = 0; i < this.iterations; i++) {
            this.iteration();
            if (
                this.configService.getConfig().gradientDescentSettings.shouldLog &&
                i % this.configService.getConfig().gradientDescentSettings.logRate === 0 &&
                i !== 0
            ) {
                if (iterationTime)
                    console.log(`done with iteration ${i} ${performance.now() - iterationTime}`);
                iterationTime = performance.now();
            }
        }
        if (this.configService.getConfig().gradientDescentSettings.shouldLog)
            console.log(`total time ${performance.now() - startTime}`);
        this.save();
    }

    public save() {
        this.posData.forEach((pos, key) => {
            const n = this.graphRegistryService.nodeMap.get(key);
            if (n) n['position'] = pos;
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
        return v;
    }

    public maxNeighborCount = 0;

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

            if (node2) {
                const node1Neighbors = this.connectedNodes.get(node1Pub)!;
                node1Neighbors.push(node2);
                if (node1Neighbors.length > this.maxNeighborCount)
                    this.maxNeighborCount = node1Neighbors.length;
            }
            if (node1) {
                const node2Neighbors = this.connectedNodes.get(node2Pub)!;
                node2Neighbors.push(node1);
                if (node2Neighbors.length > this.maxNeighborCount)
                    this.maxNeighborCount = node2Neighbors.length;
            }

            this.posData.set(node1Pub, this.getRandomVector(node1Pub));
            this.posData.set(node2Pub, this.getRandomVector(node2Pub));
        });
    }
}
