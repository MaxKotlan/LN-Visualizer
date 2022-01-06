import { LndNode } from './node.interface';
import * as THREE from 'three';
import PriorityQueue from 'ts-priority-queue';
import { LndChannel } from '.';

export interface LndNodeWithPosition extends LndNode {
    position: THREE.Vector3;
    //connectedChannels: PriorityQueue<LndChannel>;
}
