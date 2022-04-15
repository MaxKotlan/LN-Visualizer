import { injectable } from 'inversify';
import { GetNetworkGraphResult } from 'lightning';
import * as THREE from 'three';
import { createSpherePoint } from '../utils/create-sphere.util';
import { GraphRegistryService } from './graph-registry.service';

@injectable()
export class PositionCalculatorService {
    constructor(public graphRegistryService: GraphRegistryService) {}

    public calculatePositions() {
        this.graphRegistryService.nodeMap.forEach((node) => {
            const initPos = new THREE.Vector3(0, 0, 0);
            createSpherePoint(0.4, new THREE.Vector3(0, 0, 0), node.public_key, initPos);
            node['position'] = initPos;
        });
    }
}
