import { createReducer, on } from '@ngrx/store';
import { ChunkInfo } from 'api/src/models/chunkInfo.interface';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import * as graphActions from '../actions/graph.actions';
import { LndChannel } from '../../../types/channels.interface';

export interface GraphState {
    chunkInfo: ChunkInfo | null;
    nodeChunksProcessed: number;
    channelChunksProcessed: number;

    nodeVertexBufferSize: number;
    nodeColorBufferSize: number;
    nodeCapacityBufferSize: number;

    channelVertexBuffer: Float32Array | null;
    channelColorBuffer: Uint8Array | null;
    nodeSet: Map<string, LndNodeWithPosition>;
    channelSet: Map<string, LndChannel>;
    nodeCount: number;
    channelCount: number;
    loadingText: string;
    totalChannelCapacity: number;
    maximumChannelCapacity: number;
    minimumChannelCapacity: number;
}

const initialState: GraphState = {
    chunkInfo: null,
    nodeChunksProcessed: 0,
    channelChunksProcessed: 0,
    nodeVertexBufferSize: 0,
    nodeColorBufferSize: 0,
    nodeCapacityBufferSize: 0,
    channelVertexBuffer: null,
    channelColorBuffer: null,
    nodeSet: new Map<string, LndNodeWithPosition>(),
    channelSet: new Map<string, LndChannel>(),
    nodeCount: 0,
    channelCount: 0,
    loadingText: '',
    totalChannelCapacity: 0,
    maximumChannelCapacity: 0,
    minimumChannelCapacity: Infinity,
};

//Allocate 10% extra buffer space for new channels and nodes
const bufferOverheadStorage = 1.1;

export const reducer = createReducer(
    initialState,
    on(graphActions.processChunkInfo, (state, { chunkInfo }) => ({
        ...state,
        chunkInfo,

        nodeVertexBufferSize: Math.floor(chunkInfo.nodes * bufferOverheadStorage) * 3,
        nodeColorBufferSize: Math.floor(chunkInfo.nodes * bufferOverheadStorage) * 3,
        nodeCapacityBufferSize: Math.floor(chunkInfo.nodes * bufferOverheadStorage) * 3,

        channelVertexBuffer: new Float32Array(
            Math.floor(chunkInfo.edges * 2 * bufferOverheadStorage) * 3,
        ),
        channelColorBuffer: new Uint8Array(
            Math.floor(chunkInfo.edges * 2 * bufferOverheadStorage) * 3,
        ),
    })),
    on(graphActions.processGraphNodeChunk, (state) => ({
        ...state,
        loadingText: `Downloading Nodes ${state.nodeChunksProcessed + 1} / ${
            state.chunkInfo?.edgeChunks
        }`,
    })),
    on(graphActions.processGraphChannelChunk, (state) => ({
        ...state,
        loadingText: `Downloading Channels ${state.channelChunksProcessed + 1} / ${
            state.chunkInfo?.edgeChunks
        }`,
    })),
    on(graphActions.cacheProcessedGraphNodeChunk, (state, { nodeSet }) => ({
        ...state,
        nodeSet,
        nodeChunksProcessed: state.nodeChunksProcessed + 1,
    })),
    on(graphActions.cacheProcessedChannelChunk, (state, { channelSet }) => ({
        ...state,
        channelSet,
        channelChunksProcessed: state.channelChunksProcessed + 1,
    })),
    on(graphActions.cacheProcessedGraphNodeChunk, (state, { nodeSet }) => ({
        ...state,
        nodeCount: nodeSet.size,
    })),
    on(graphActions.cacheProcessedChannelChunk, (state, { channelSet }) => ({
        ...state,
        channelCount: channelSet.size,
    })),
    on(graphActions.setTotalChannelCapacity, (state, { totalChannelCapacity }) => ({
        ...state,
        totalChannelCapacity,
    })),
    on(graphActions.setMaximumChannelCapacity, (state, { maximumChannelCapacity }) => ({
        ...state,
        maximumChannelCapacity,
    })),
    on(graphActions.setMinimumChannelCapacity, (state, { minimumChannelCapacity }) => ({
        ...state,
        minimumChannelCapacity,
    })),
);
