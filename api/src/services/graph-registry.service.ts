import { injectable } from 'inversify/lib/annotation/injectable';
import { GetNetworkGraphResult } from 'lightning';
import { LndChannel, LndNode } from '../models';
import 'reflect-metadata';

function forceGC(): void{
   if (global.gc) {
      global.gc();
   } else {
      console.warn('No GC hook! Start your program as `node --expose-gc file.js`.');
   }
}

@injectable()
export class GraphRegistryService {
    mapToRegistry(gstate: GetNetworkGraphResult) {
        this.nodeMap.clear();
        this.channelMap.clear();
        gstate.nodes.forEach((node) => {
            this.nodeMap.set(node.public_key, node as any);
        });
        gstate.channels.forEach((channel) => {
            this.channelMap.set(channel.id, channel as any);
        });
        this.recalculateNodeArray();
        this.recalculateChannelArray();
        forceGC();
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

    public updateFromWorkerThread(workerThreadState: GraphRegistryService) {
        this.nodeMap = workerThreadState.nodeMap;
        this.channelMap = workerThreadState.channelMap;
        this.recalculateNodeArray();
        this.recalculateChannelArray();
    }
}
