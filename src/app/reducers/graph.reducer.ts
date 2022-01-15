import { createReducer, on } from '@ngrx/store';
import { ChunkInfo } from 'api/src/models/chunkInfo.interface';
import { LndNodeWithPosition } from 'api/src/models/node-position.interface';
import * as graphActions from '../actions/graph.actions';
import { LndChannel } from '../types/channels.interface';

export interface GraphState {
    chunkInfo: ChunkInfo | null;
    nodeChunksProcessed: number;
    channelChunksProcessed: number;
    nodeVertexBuffer: Float32Array | null;
    nodeColorBuffer: Uint8Array | null;
    channelVertexBuffer: Float32Array | null;
    channelColorBuffer: Uint8Array | null;
    nodeSet: Map<string, LndNodeWithPosition>;
    channelSet: Map<string, LndChannel>;
    loadingText: string;
}

const initialState: GraphState = {
    chunkInfo: null,
    nodeChunksProcessed: 0,
    channelChunksProcessed: 0,
    nodeVertexBuffer: null,
    nodeColorBuffer: null,
    channelVertexBuffer: null,
    channelColorBuffer: null,
    nodeSet: new Map<string, LndNodeWithPosition>(),
    channelSet: new Map<string, LndChannel>(),
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
    // on(graphActions.cacheProcessedGraphNodeChunk, (state, { nodeSet }) => {
    //     //console.log(nodeSet);
    //     state.nodeSet = nodeSet;
    //     return state;
    // }),
    // on(graphActions.cacheProcessedChannelChunk, (state, { channelSet }) => {
    //     //console.log(channelSet);
    //     state.channelSet = channelSet;
    //     return state;
    // }),
    // on(graphActions.graphNodePositionRecalculate, (state) => ({
    //     ...state,
    //     loadingText: 'Recomputing Graph...',
    // })),
);
