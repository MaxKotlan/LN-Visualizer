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
        let resultAccumulator = true;
        filters.forEach((filter) => {
            let result = null;
            if (filter.interpreter === 'javascript') result = filter.function(entity);
            resultAccumulator = resultAccumulator && result;
        });
        return resultAccumulator;
    }
}
