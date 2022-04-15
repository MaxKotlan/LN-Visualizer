import { injectable } from 'inversify/lib/annotation/injectable';
import { GetNetworkGraphResult } from 'lightning';
import { LndChannel, LndNode } from '../models';

@injectable()
export class GraphRegistryService {
    mapToRegistry(gstate: GetNetworkGraphResult) {
        gstate.nodes.forEach((node) => {
            this.nodeMap.set(node.public_key, node as any);
        });
        gstate.channels.forEach((channel) => {
            this.channelMap.set(channel.id, channel as any);
        });
        this.recalculateNodeArray();
        this.recalculateChannelArray();
    }

    public nodeMap: Map<string, LndNode> = new Map();
    public channelMap: Map<string, LndChannel> = new Map();

    public nodeArray;
    public channelArray;

    protected recalculateNodeArray() {
        this.nodeArray = Array.from(this.nodeMap.values());
    }

    protected recalculateChannelArray() {
        this.channelArray = Array.from(this.channelMap.values());
    }
}
