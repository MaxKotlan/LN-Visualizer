import { LndNode } from './node.interface';
import * as THREE from 'three';
import { MaxPriorityQueue } from '@datastructures-js/priority-queue';
import { LndChannel } from '.';

export interface LndNodeWithPosition extends LndNode {
    position: THREE.Vector3;
    connectedChannels: MaxPriorityQueue<LndChannel>;
}
