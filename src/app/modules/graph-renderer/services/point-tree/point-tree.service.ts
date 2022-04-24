import { Injectable } from '@angular/core';
import * as kdTree from 'kd-tree-javascript';
import { meshScale } from 'src/app/constants/mesh-scale.constant';
import { Vector3 } from 'three';
import { NodeRegistryService } from '../node-registry/node-registry.service';

const tempA = new Vector3(0, 0, 0);
const tempB = new Vector3(0, 0, 0);

const distance = (a: Array<number>, b: Array<number>) => {
    tempA.set(a[0], a[1], a[2]);
    tempB.set(b[0], b[1], b[2]);
    return tempA.distanceTo(tempB);
};

@Injectable({
    providedIn: 'root',
})
export class PointTreeService {
    constructor(private nodeRegistry: NodeRegistryService) {}

    public tree: any;

    public buildKDTree() {
        const a = Array.from(this.nodeRegistry.values()).map((c) => [
            c.position.x,
            c.position.y,
            c.position.z,
            c.public_key,
        ]);
        this.tree = new kdTree.kdTree(a, distance, ['0', '1', '2']);
    }

    public getNearestNeighbor(position: Vector3) {
        if (!position || !position.x || !position.y || !position.z) return;
        position.divideScalar(meshScale);
        const a = this.tree.nearest([position.x, position.y, position.z], 1)[0][0];
        return this.nodeRegistry.get(a[3]);
    }
}
