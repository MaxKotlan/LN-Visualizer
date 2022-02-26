import { createReducer, on } from '@ngrx/store';
import { ChunkInfo } from 'api/src/models/chunkInfo.interface';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import * as graphActions from '../actions/graph.actions';
import { LndChannel } from '../types/channels.interface';

export interface GraphState {
    chunkInfo: ChunkInfo | null;
    nodeChunksProcessed: number;
    channelChunksProcessed: number;
    nodeVertexBuffer: Float32Array | null;
    nodeColorBuffer: Uint8Array | null;
    nodeCapacityBuffer: Float32Array | null;
    channelVertexBuffer: Float32Array | null;
    channelColorBuffer: Uint8Array | null;
    nodeSet: Map<string, LndNodeWithPosition>;
    channelSet: Map<string, LndChannel>;
    nodeCount: number;
    channelCount: number;
    loadingText: string;
}

const initialState: GraphState = {
    chunkInfo: null,
    nodeChunksProcessed: 0,
    channelChunksProcessed: 0,
    nodeVertexBuffer: null,
    nodeColorBuffer: null,
    nodeCapacityBuffer: null,
    channelVertexBuffer: null,
    channelColorBuffer: null,
    nodeSet: new Map<string, LndNodeWithPosition>(),
    channelSet: new Map<string, LndChannel>(),
    nodeCount: 0,
    channelCount: 0,
    loadingText: '',
};

//Allocate 10% extra buffer space
const bufferOverheadStorage = 1.1;

export const reducer = createReducer(
    initialState,
    on(graphActions.processChunkInfo, (state, { chunkInfo }) => ({
        ...state,
        chunkInfo,
        nodeVertexBuffer: new Float32Array(Math.floor(chunkInfo.nodes * bufferOverheadStorage) * 3),
        nodeColorBuffer: new Uint8Array(Math.floor(chunkInfo.nodes * bufferOverheadStorage) * 3),
        nodeCapacityBuffer: new Float32Array(Math.floor(chunkInfo.nodes * bufferOverheadStorage)),
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
);
