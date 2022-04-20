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

    channelVertexBufferSize: number;
    channelColorBufferSize: number;

    // nodeSet: Map<string, LndNodeWithPosition>;
    // channelSet: Map<string, LndChannel>;
    nodeCount: number;
    channelCount: number;
    loadingText: string;
    totalChannelCapacity: number;
    maximumChannelCapacity: number;
    minimumChannelCapacity: number;
    isRequestInitiating: boolean;
}

const initialState: GraphState = {
    isRequestInitiating: false,
    chunkInfo: null,
    nodeChunksProcessed: 0,
    channelChunksProcessed: 0,
    nodeVertexBufferSize: 0,
    nodeColorBufferSize: 0,
    nodeCapacityBufferSize: 0,
    channelVertexBufferSize: 0,
    channelColorBufferSize: 0,
    // nodeSet: new Map<string, LndNodeWithPosition>(),
    // channelSet: new Map<string, LndChannel>(),
    nodeCount: 0,
    channelCount: 0,
    loadingText: '',
    totalChannelCapacity: 0,
    maximumChannelCapacity: 0,
    minimumChannelCapacity: Infinity,
};

//Allocate 10% extra buffer space for new channels and nodes
const bufferOverheadStorage = 1.0;

export const reducer = createReducer(
    initialState,
    //on(graphActions)
    on(graphActions.initializeGraphSyncProcess, (state) => ({
        ...state,
        isRequestInitiating: true,
    })),
    on(graphActions.loadGraphFromStorage, (state) => ({
        ...state,
        isRequestInitiating: true,
    })),
    on(graphActions.processChunkInfo, (state, { chunkInfo }) => ({
        ...state,
        chunkInfo,
        nodeVertexBufferSize: Math.floor(chunkInfo.nodes * bufferOverheadStorage) * 3,
        nodeColorBufferSize: Math.floor(chunkInfo.nodes * bufferOverheadStorage) * 3,
        nodeCapacityBufferSize: Math.floor(chunkInfo.nodes * bufferOverheadStorage) * 3,
        channelVertexBufferSize: Math.floor(chunkInfo.edges * 2 * bufferOverheadStorage) * 3,
        channelColorBufferSize: Math.floor(chunkInfo.edges * 2 * bufferOverheadStorage) * 3,
    })),
    on(graphActions.processGraphNodeChunk, (state) => ({
        ...state,
        isRequestInitiating: false,
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
    on(graphActions.cacheProcessedGraphNodeChunk, (state, { isFromDatabase }) => ({
        ...state,
        nodeChunksProcessed: isFromDatabase
            ? state.nodeChunksProcessed
            : state.nodeChunksProcessed + 1,
        isRequestInitiating: false,
    })),
    on(graphActions.cacheProcessedChannelChunk, (state) => ({
        ...state,
        channelChunksProcessed: state.channelChunksProcessed + 1,
    })),
    // on(graphActions.cacheProcessedGraphNodeChunk, (state, { nodeSet }) => ({
    //     ...state,
    //     nodeCount: nodeSet.size,
    // })),
    // on(graphActions.cacheProcessedChannelChunk, (state) => ({
    //     ...state,
    //     // channelCount: channelSet.size,
    // })),
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
