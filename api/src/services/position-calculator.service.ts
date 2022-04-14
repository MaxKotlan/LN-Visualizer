import { injectable } from 'inversify';
import { GetNetworkGraphResult } from 'lightning';
import * as THREE from 'three';
import { createSpherePoint } from '../utils/create-sphere.util';

@injectable()
export class PositionCalculatorService {
    public calculatePositions(graphState: GetNetworkGraphResult) {
        graphState.nodes.forEach((node) => {
            const initPos = new THREE.Vector3(0, 0, 0);
            createSpherePoint(0.4, new THREE.Vector3(0, 0, 0), node.public_key, initPos);
            node['position'] = initPos;
        });
    }
}
