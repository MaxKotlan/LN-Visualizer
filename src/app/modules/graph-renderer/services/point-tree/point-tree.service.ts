import { Injectable } from '@angular/core';
import * as kdTree from 'kd-tree-javascript';
import { meshScale } from 'src/app/constants/mesh-scale.constant';
import { Ray, Vector3 } from 'three';
import { NodeRegistryService } from '../node-registry/node-registry.service';

const tempA = new Vector3(0, 0, 0);
const tempB = new Vector3(0, 0, 0);

const distance = (a: Array<number>, b: Array<number>) => {
    if (a instanceof Ray) {
        // let c = new Vector3();
        tempB.set(b[0], b[1], b[2]);
        // c = a.closestPointToPoint(tempB, c);
        // tempA.set(c.x, c.y, c.z);
        return a.distanceToPoint(tempB);
    } else if (b instanceof Ray) {
        // let c = new Vector3();
        // tempB.set(a[0], a[1], a[2]);
        // c = b.closestPointToPoint(tempB, c);
        // tempA.set(c.x, c.y, c.z);
        // let c = new Vector3();
        tempA.set(a[0], a[1], a[2]);
        // c = a.closestPointToPoint(tempB, c);
        // tempA.set(c.x, c.y, c.z);
        return b.distanceToPoint(tempA);
    } else {
        tempA.set(a[0], a[1], a[2]);
        tempB.set(b[0], b[1], b[2]);
        return tempA.distanceTo(tempB);
    }
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
        //console.log(position);
        if (!position || !position.x || !position.y || !position.z) return;
        position.divideScalar(meshScale);
        const a = this.tree.nearest([position.x, position.y, position.z], 1)[0][0];
        return this.nodeRegistry.get(a[3]);
    }

    public getNearestNeighborToRay(ray: Ray) {
        //console.log(ray);
        ray.origin.divideScalar(meshScale);
        const a = this.tree.nearest(ray, 1)[0][0];
        //console.log(this.nodeRegistry.get(a[3]));
        return this.nodeRegistry.get(a[3]);
    }
}
