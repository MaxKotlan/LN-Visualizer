import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { Chunk } from '../types/chunk.interface';
import { LnGraph } from '../types/graph.interface';
import { LndNode } from '../types/node.interface';

export const requestGraph = createAction('[graph] requestGraph');

export const requestGraphSuccess = createAction(
    '[graph] requestGraphSuccess',
    props<{ graph: LnGraph }>(),
);

export const requestGraphFailure = createAction(
    '[graph] requestGraphFailure',
    props<{ error: HttpErrorResponse }>(),
);

export const processGraphNodeChunk = createAction(
    '[graph] processGraphNodeChunk',
    props<{ chunk: Chunk<LndNode> }>(),
);

export const processChannelNodeChunk = createAction(
    '[graph] processChannelNodeChunk',
    props<{ chunk: Chunk<LndNode> }>(),
);

export const dismissError = createAction('[graph] dismissError');
