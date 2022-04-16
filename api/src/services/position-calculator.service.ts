import { injectable } from 'inversify';
import * as THREE from 'three';
import { createSpherePoint } from '../utils/create-sphere.util';
import { GraphRegistryService } from './graph-registry.service';
import { MaxPriorityQueue } from '@datastructures-js/priority-queue';
import { Vector3 } from 'three';
import { LndChannel, LndNode } from '../models';

type NodePublicKey = string;
type ChannelId = string;

@injectable()
export class PositionCalculatorService {
    constructor(public graphRegistryService: GraphRegistryService) {}

    public positionRegistry: Map<NodePublicKey, Vector3> = new Map();
    private connectedNode: Map<ChannelId, MaxPriorityQueue<any>> = new Map();
    private connectedChannels: Map<NodePublicKey, MaxPriorityQueue<LndChannel>> = new Map();
    private children: Map<NodePublicKey, LndNode> = new Map();
    private nodeParents: Map<NodePublicKey, LndNode> = new Map();
    private channelParents: Map<ChannelId, LndNode> = new Map();
    private depth: Map<NodePublicKey, number> = new Map();

    public calculatePositions() {
        this.initPositions();
        this.calculateHeirarchy();
        this.calculatePositionFromHeiarchy();

        this.graphRegistryService.nodeMap.forEach(
            (n) => (n['position'] = this.positionRegistry[n.public_key]),
        );
    }

    public initPositions() {
        this.graphRegistryService.nodeMap.forEach((node) => {
            const initPos = new THREE.Vector3(0, 0, 0);
            createSpherePoint(0.4, new THREE.Vector3(0, 0, 0), node.public_key, initPos);
            this.positionRegistry[node.public_key] = initPos;
        });
    }

    public calculateHeirarchy() {
        this.graphRegistryService.channelMap.forEach((channel) => {
            const node1 = this.graphRegistryService.nodeMap.get(channel.policies[0].public_key);
            const node2 = this.graphRegistryService.nodeMap.get(channel.policies[1].public_key);

            if (!node1) return;
            if (!node2) return;

            this.enqueueChannel(node1, node1, channel);

            this.checkAndInitializeMap(node1.public_key, this.connectedChannels);

            const chnl = this.connectedChannels[node1.public_key].front();

            const potentialParent1 = this.graphRegistryService.nodeMap.get(
                this.selectOtherNodeInChannel(node1.public_key, chnl),
            );

            if (potentialParent1?.public_key)
                this.checkAndInitializePriorityQueue(
                    potentialParent1.public_key,
                    this.connectedChannels,
                );
            else throw new Error('Not expected');

            if (
                potentialParent1 &&
                this.connectedChannels[node1.public_key].size() <
                    this.connectedChannels[potentialParent1.public_key].size() &&
                !this.nodeParents[node1.public_key]
            ) {
                this.nodeParents[node1.public_key] = potentialParent1;
                const h = this.nodeParents[node1.public_key].public_key;
                this.checkAndInitializeMap(h, this.children);
                this.children[h].set(node1.public_key, node1);
            }

            this.enqueueChannel(node2, node2, channel);

            this.checkAndInitializePriorityQueue(node2.public_key, this.connectedChannels);

            const chn2 = this.connectedChannels[node2.public_key].front();
            const potentialParent2 = this.graphRegistryService.nodeMap.get(
                this.selectOtherNodeInChannel(node2.public_key, chn2),
            );

            if (potentialParent2?.public_key)
                this.checkAndInitializePriorityQueue(
                    potentialParent2.public_key,
                    this.connectedChannels,
                );
            else throw new Error('Not expected');

            if (
                potentialParent2 &&
                this.connectedChannels[node2.public_key].size() <
                    this.connectedChannels[potentialParent2.public_key].size() &&
                !this.nodeParents[node2.public_key]
            ) {
                this.nodeParents[node2.public_key] = potentialParent2;
                const h = this.nodeParents[node2.public_key].public_key;
                this.checkAndInitializeMap(h, this.children);
                this.children[h].set(node2.public_key, node2);
            }
        });
    }

    private selectOtherNodeInChannel(selfPubkey: string, channel: LndChannel): string {
        if (channel.policies[0].public_key === selfPubkey) return channel.policies[1].public_key;
        if (channel.policies[1].public_key === selfPubkey) return channel.policies[0].public_key;
        throw new Error('Public Key is not either of the nodes in the channel');
    }

    private enqueueChannel(lndNode: LndNode, otherNode: LndNode, channel: LndChannel) {
        if (!lndNode) return;
        const lndPar = channel;

        //this.parents[lndPar.]
        this.channelParents[lndPar.id] = otherNode;

        // lndPar.parent = otherNode;
        // lndNode.node_capacity += channel.capacity;
        // lndNode.channel_count += 1;

        this.checkAndInitializePriorityQueue(lndNode.public_key, this.connectedChannels);
        this.connectedChannels[lndNode.public_key].enqueue(lndPar);
        // lndNode.connectedChannels.enqueue(lndPar);
    }

    private checkAndInitializePriorityQueue(pubKey: NodePublicKey, map: Map<NodePublicKey, any>) {
        if (!map[pubKey])
            map[pubKey] = new MaxPriorityQueue<LndChannel>(this.getNodeQueueComparitor());
    }

    private checkAndInitializeMap(pubKey: NodePublicKey, map: Map<NodePublicKey, any>) {
        if (!map[pubKey]) map[pubKey] = new Map<NodePublicKey, LndNode>();
    }

    private getNodeQueueComparitor() {
        const j = {
            compare: (a: LndChannel, b: LndChannel): number => {
                const u = (n) => {
                    const r = this.nodeParents[this.channelParents[n.id].public_key];
                    if (!r) return 0;
                    const h = r.public_key;
                    if (!this.children[h]) this.children[h] = new Map<string, LndNode>();
                    return this.children[h].size;
                };
                u.bind(this);

                if (!u(b) && !u(a)) return 0;
                if (u(b) && !u(a)) return -1;
                if (!u(b) && u(a)) return -1;

                if (u(b) > u(a)) return -1;
                if (u(b) < u(a)) return -1;
                return u(b) - u(a);

                // if (!b.parent.parent?.children.size && !a.parent.parent?.children.size) return 0;
                // if (b.parent.parent?.children.size && !a.parent.parent?.children.size) return -1;
                // if (!b.parent.parent?.children.size && a.parent.parent?.children.size) return 1;

                // if (b.parent.parent!.children.size > a.parent.parent!.children.size) return -1;
                // if (a.parent.parent!.children.size > b.parent.parent!.children.size) return 1;
                // return b.parent.children.size - a.parent.children.size;
            },
        };
        j.compare.bind(this);
        return j;
    }

    public calculatePositionFromHeiarchy() {
        const queue: LndNode[] = [];
        const visited: LndNode[] = [];

        let parentCount = 0;
        this.graphRegistryService.nodeMap.forEach((node) => {
            if (!this.nodeParents[node.public_key]) {
                parentCount++;
                createSpherePoint(
                    0.4,
                    new THREE.Vector3(0, 0, 0),
                    node.public_key.slice(0, 10),
                    this.positionRegistry[node.public_key],
                );
                queue.push(node);
            }
        });

        console.log('Unparented Nodes: ', parentCount);

        let parented = 0;
        while (queue.length > 0) {
            const v = queue.pop();
            if (v?.public_key)
                this.children[v.public_key]?.forEach((w) => {
                    if (!visited.includes(w.public_key)) {
                        if (!this.depth[v.public_key]) this.depth[v.public_key] = 1;
                        this.depth[w.public_key] = this.depth[v.public_key] + 1;
                        createSpherePoint(
                            0.4 / this.depth[w.public_key],
                            this.positionRegistry[v.public_key],
                            w.public_key.slice(0, 10),
                            this.positionRegistry[w.public_key],
                        );
                        parented++;
                        queue.push(w);
                        visited.push(w.public_key);
                    }
                });
        }

        console.log('Parented Nodes', parented);
    }
}
