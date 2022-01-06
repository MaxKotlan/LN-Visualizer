import { injectable } from 'inversify';
import { GetNetworkGraphResult } from 'lightning';
import { LndChannel } from '../models';
import { Chunk } from '../models/chunk.interface';
import { ChunkInfo } from '../models/chunkInfo.interface';
import { LndNode } from '../models/node.interface';

@injectable()
export class LndChunkTrackerService {
    public readonly chunkSize: number = 1024 * 2;

    public chunkInfo: ChunkInfo | null = null;
    public nodeChunks: Chunk<LndNode>[] = [];
    public channelChunks: Chunk<LndChannel>[] = [];

    public splitGraphIntoChunks(graph: GetNetworkGraphResult) {
        for (let i = 0; i < graph.nodes.length / this.chunkSize; i++)
            this.pushNodeChunk(i, graph.nodes);

        for (let i = 0; i < graph.channels.length / this.chunkSize; i++)
            this.pushChannelChunk(i, graph.channels);

        this.chunkInfo = {
            nodes: graph.nodes.length,
            edges: graph.channels.length,
            nodeChunks: this.nodeChunks.length,
            edgeChunks: this.channelChunks.length,
            type: 'chunkInfo',
        } as ChunkInfo;
        console.log('CHUNK INFO:', this.chunkInfo);
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
