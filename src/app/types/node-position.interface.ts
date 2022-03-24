import { LndNode } from '../../../api/src/models/node.interface';
import * as THREE from 'three';
import { MaxPriorityQueue } from '@datastructures-js/priority-queue';
import { LndChannel } from '../../../api/src/models';

export interface LndNodeWithPosition extends LndNode {
    position: THREE.Vector3;
    connectedChannels: MaxPriorityQueue<LndChannelWithParent>;
    parent: LndNodeWithPosition | null;
    children: Map<string, LndNodeWithPosition>;
    node_capacity: number;
    visited: boolean;
    depth: number;
}

export interface LndChannelWithParent extends LndChannel {
    parent: LndNodeWithPosition;
}
