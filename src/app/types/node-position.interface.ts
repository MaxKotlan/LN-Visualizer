import { LndNode } from '../../../api/src/models/node.interface';
import * as THREE from 'three';
import { MaxPriorityQueue } from '@datastructures-js/priority-queue';
import { LndChannel } from '../../../api/src/models';

export interface LndNodeWithPosition extends LndNode {
    position: THREE.Vector3;
    connected_channels: Map<string, LndChannel>;
    // parent: LndNodeWithPosition | null;
    // children: Map<string, LndNodeWithPosition>;
    node_capacity: number;
    node_channel_count: number;
    // visited: boolean;
    // depth: number;
}

export interface LndChannelWithParent extends LndChannel {
    parent: LndNodeWithPosition;
}
