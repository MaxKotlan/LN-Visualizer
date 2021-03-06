import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { LndChannel } from 'api/src/models';
import { ChunkInfo } from 'api/src/models/chunkInfo.interface';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import { Chunk } from '../../../types/chunk.interface';
import { LnGraph } from '../../../types/graph.interface';
import { LndNode } from '../../../types/node.interface';

export const requestGraph = createAction('[graph] requestGraph');

export const initiateRequest = createAction('[graph] initiateRequest');

export const requestGraphSuccess = createAction(
    '[graph] requestGraphSuccess',
    props<{ graph: LnGraph }>(),
);

export const setRequestInitiating = createAction(
    '[graph] setRequestInitiating',
    props<{ requestInitiating: boolean }>(),
);

export const setIsLoadFromStorage = createAction(
    '[graph] setIsLoadFromStorage',
    props<{ isLoadFromStorage: boolean }>(),
);

export const initializeGraphSyncProcess = createAction(
    '[graph] initializeGraphSyncProcess',
    props<{ overrideSync?: string | undefined }>(),
);

export const requestGraphFailure = createAction(
    '[graph] requestGraphFailure',
    props<{ error: HttpErrorResponse }>(),
);

export const processGraphNodeChunk = createAction(
    '[graph] processGraphNodeChunk',
    props<{ chunk: Chunk<LndNode> }>(),
);

export const concatinateNodeChunk = createAction(
    '[graph] concatinateNodeChunk',
    props<{ nodeSubSet: LndNodeWithPosition[] }>(),
);

export const nodeStatisticsComputationFinished = createAction(
    '[graph] nodeStatisticsComputationFinished',
);

export const cacheProcessedGraphNodeChunk = createAction('[graph] cacheProcessedGraphNodeChunk');

export const setFilteredNodes = createAction('[graph] setFilteredNodes');

export const setFilteredNodeChannels = createAction('[graph] setFilteredNodeChannels');

export const concatinateChannelChunk = createAction(
    '[graph] concatinateChannelChunk',
    props<{ channelSubSet: LndChannel[] }>(),
);

export const channelStatisticsDoneComputing = createAction(
    '[graph] channelStatisticsDoneComputing',
);

export const cacheProcessedChannelChunk = createAction('[graph] cacheProcessedChannelChunk');

export const graphNodePositionRecalculate = createAction('[graph] graphNodePositionRecalculate');

export const processGraphChannelChunk = createAction(
    '[graph] processGraphChannelChunk',
    props<{ chunk: Chunk<LndChannel> }>(),
);

export const processChunkInfo = createAction(
    '[graph] processChunkInfo',
    props<{ chunkInfo: ChunkInfo }>(),
);

export const initSyncRequestComplete = createAction('[graph] initSyncRequestComplete');

export const setTotalChannelCapacity = createAction(
    '[graph] setTotalChannelCapacity',
    props<{ totalChannelCapacity: number }>(),
);

export const setMaximumChannelCapacity = createAction(
    '[graph] setMaximumChannelCapacity',
    props<{ maximumChannelCapacity: number }>(),
);

export const setMinimumChannelCapacity = createAction(
    '[graph] setMinimumChannelCapacity',
    props<{ minimumChannelCapacity: number }>(),
);

export const errorUnknownChunkDataType = createAction('[graph] errorUnknownChunkDataType');

export const channelClosed = createAction('[graph] channelClosed', props<{ channelId: string }>());

export const channelUpdated = createAction(
    '[graph] channelUpdated',
    props<{ channelId: string }>(),
);

export const recomputeCanvasSize = createAction('[graph] recomputeCanvasSize');
