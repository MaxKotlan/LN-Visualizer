import { LndNode } from './node.interface';
import * as THREE from 'three';

export interface LndNodeWithPosition extends LndNode {
    position: THREE.Vector3;
}
