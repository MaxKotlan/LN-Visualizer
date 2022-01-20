import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class NodePositionRegistryService {
    public nodePosition: Record<string, THREE.Vector3> = {};
    //public nodeCentrality: Record<string, number> = {};

    constructor() {}

    // public pushSpherePoint = (i: number, pubkey: string) => {
    //   let x = Math.random()-.5;
    //   let y = (Math.random()-.5)/1;
    //   let z = Math.random()-.5;
    //   const mag = (1/Math.sqrt(i))*Math.sqrt(x*x + y*y + z*z);
    //   x /= mag; y /= mag; z /= mag;
    //   this.nodePosition[pubkey] = new THREE.Vector3(x, y, z);
    // }
}
