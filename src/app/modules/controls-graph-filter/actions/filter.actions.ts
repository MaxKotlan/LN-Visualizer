import { createAction, props } from '@ngrx/store';
import {
    ChannelEvaluationFunction,
    Filter,
    NodeEvaluationFunction,
} from '../types/filter.interface';

export const addChannelFilter = createAction(
    '[filter] addChannelFilter',
    props<{ value: Filter<ChannelEvaluationFunction> }>(),
);

export const removeChannelFilter = createAction(
    '[filter] removeChannelFilter',
    props<{ value: Filter<ChannelEvaluationFunction> }>(),
);

export const updateChannelFilterByIssueId = createAction(
    '[filter] updateChannelFilterByIssueId',
    props<{ value: Filter<ChannelEvaluationFunction> }>(),
);

export const updateNodeFilterByIssueId = createAction(
    '[filter] updateNodeFilterByIssueId',
    props<{ value: Filter<NodeEvaluationFunction> }>(),
);

export const removeChannelFilterByIssueId = createAction(
    '[filter] removeChannelFilterByIssueId',
    props<{ issueId: string }>(),
);

export const setAllowedFilterKeys = createAction(
    '[filter] setAllowedFilterKeys',
    props<{ value: string[] }>(),
);
