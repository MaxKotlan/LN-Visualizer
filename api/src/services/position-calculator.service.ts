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

    private positionRegistry: Map<NodePublicKey, Vector3> = new Map();
    private connectedNode: Map<ChannelId, MaxPriorityQueue<any>> = new Map();
    private connectedChannels: Map<NodePublicKey, MaxPriorityQueue<LndChannel>> = new Map();
    private children: Map<string, LndNode> = new Map();
    private nodeParents: Map<NodePublicKey, LndNode> = new Map();
    private channelParents: Map<NodePublicKey, LndNode> = new Map();

    public calculatePositions() {
        this.initPositions();
        this.calculateHeirarchy();
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
                !this.connectedChannels[node1.public_key]
            ) {
                this.nodeParents[node1.public_key] = potentialParent1;
                this.children[this.nodeParents[node1.public_key].public_key].set(
                    node1.public_key,
                    node1,
                );
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
                !this.connectedChannels[node2.public_key]
            ) {
                this.nodeParents[node2.public_key] = potentialParent2;
                this.children[this.nodeParents[node2.public_key].public_key].set(
                    node2.public_key,
                    node2,
                );
            }

            // const chn2: LndChannelWithParent =
            //     node2.connectedChannels.front() as LndChannelWithParent;
            // const potentialParent2 = nodeRegistry.nodeSet.get(
            //     this.selectOtherNodeInChannel(node2.public_key, chn2),
            // );

            // if (
            //     potentialParent2 &&
            //     node2.connectedChannels.size() < potentialParent2.connectedChannels.size() &&
            //     !node2.parent
            // ) {
            //     node2.parent = potentialParent2;
            //     node2.parent.children.set(node2.public_key, node2);
            // }
        });
        console.log(this);
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

        if (!this.connectedChannels[lndNode.public_key])
            this.connectedChannels[lndNode.public_key] = new MaxPriorityQueue<LndChannel>(
                this.getNodeQueueComparitor(), //this might break some stuff
            );

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
}
