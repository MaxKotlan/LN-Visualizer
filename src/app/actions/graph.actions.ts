import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { LndChannel } from 'api/src/models';
import { ChunkInfo } from 'api/src/models/chunkInfo.interface';
import { LndNodeWithPosition } from 'api/src/models/node-position.interface';
import { Chunk } from '../types/chunk.interface';
import { LnGraph } from '../types/graph.interface';
import { LndNode } from '../types/node.interface';

export const requestGraph = createAction('[graph] requestGraph');

export const requestGraphSuccess = createAction(
    '[graph] requestGraphSuccess',
    props<{ graph: LnGraph }>(),
);

export const initializeGraphSyncProcess = createAction('[graph] initializeGraphSyncProcess');

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
    props<{ nodeSubSet: Record<string, LndNodeWithPosition> }>(),
);

export const cacheProcessedGraphNodeChunk = createAction(
    '[graph] cacheProcessedGraphNodeChunk',
    props<{ nodeSet: Record<string, LndNodeWithPosition> }>(),
);

export const concatinateChannelChunk = createAction(
    '[graph] concatinateChannelChunk',
    props<{ channelSubSet: Record<string, LndChannel> }>(),
);

export const cacheProcessedChannelChunk = createAction(
    '[graph] cacheProcessedChannelChunk',
    props<{ channelSet: Record<string, LndChannel> }>(),
);

export const graphNodePositionRecalculate = createAction(
    '[graph] graphNodePositionRecalculate',
    props<{ nodeSet: Record<string, LndNodeWithPosition> }>(),
);

export const processGraphChannelChunk = createAction(
    '[graph] processGraphChannelChunk',
    props<{ chunk: Chunk<LndChannel> }>(),
);

export const processChunkInfo = createAction(
    '[graph] processChunkInfo',
    props<{ chunkInfo: ChunkInfo }>(),
);

export const errorUnknownChunkDataType = createAction('[graph] errorUnknownChunkDataType');

export const dismissError = createAction('[graph] dismissError');
