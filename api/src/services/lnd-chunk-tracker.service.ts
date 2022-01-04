import { injectable } from 'inversify';
import { GetNetworkGraphResult } from 'lightning';
import { LndChannel } from '../models';
import { Chunk } from '../models/chunk.interface';
import { LndNode } from '../models/node.interface';

@injectable()
export class LndChunkTrackerService {
    public readonly chunkSize: number = 1024 * 2;

    public nodeChunks: Chunk<LndNode>[] = [];
    public channelChunks: Chunk<LndChannel>[] = [];

    public splitGraphIntoChunks(graph: GetNetworkGraphResult) {
        console.log(graph.nodes.length, ' nodes');
        console.log(graph.channels.length, ' channels');

        for (let i = 0; i < graph.nodes.length / this.chunkSize; i++)
            this.pushNodeChunk(i, graph.nodes);

        for (let i = 0; i < graph.channels.length / this.chunkSize; i++)
            this.pushChannelChunk(i, graph.channels);

        console.log('Total of ', this.nodeChunks.length, ' node chunks');
        console.log('Total of ', this.channelChunks.length, ' node chunks');
    }

    protected pushNodeChunk(index: number, nodes: LndNode[]) {
        const chunk: Chunk<LndNode> = {
            index,
            type: 'node',
            data: nodes.slice(index * this.chunkSize, (index + 1) * this.chunkSize),
            registry: {},
        };
        this.reRegisterNodeChunks(chunk);
        this.nodeChunks.push(chunk);
    }

    protected pushChannelChunk(index: number, channels: LndChannel[]) {
        const chunk: Chunk<LndChannel> = {
            index,
            type: 'channel',
            data: channels.slice(index * this.chunkSize, (index + 1) * this.chunkSize),
            registry: {},
        };
        this.reRegisterChannelChunks(chunk);
        this.channelChunks.push(chunk);
    }

    protected reRegisterNodeChunks(chunk: Chunk<LndNode>) {
        chunk.data.forEach((node) => (chunk.registry[node.public_key] = chunk.index));
    }

    protected reRegisterChannelChunks(chunk: Chunk<LndChannel>) {
        chunk.data.forEach((channel) => (chunk.registry[channel.id] = chunk.index));
    }
}
