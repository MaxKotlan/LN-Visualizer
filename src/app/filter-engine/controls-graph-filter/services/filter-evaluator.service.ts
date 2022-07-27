import { Injectable } from '@angular/core';
import { LndChannel } from 'api/src/models';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import {
    ChannelEvaluationFunction,
    Filter,
    NodeEvaluationFunction,
} from '../types/filter.interface';

@Injectable({
    providedIn: 'root',
})
export class FilterEvaluatorService {
    public evaluateFilters(
        entity: LndChannel | LndNodeWithPosition,
        filters: Filter<ChannelEvaluationFunction>[] | Filter<NodeEvaluationFunction>[],
    ): boolean {
        for (let i = 0; i < filters.length; i++)
            if (filters[i].function(entity as any) === false) return false;
        return true;
    }
}
