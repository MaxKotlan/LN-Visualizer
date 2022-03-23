import { Injectable } from '@angular/core';
import { LndChannel } from 'api/src/models';
import { ChannelEvaluationFunction, Filter } from '../types/filter.interface';

@Injectable({
    providedIn: 'root',
})
export class FilterEvaluatorService {
    public evaluateFilters(
        channel: LndChannel,
        filters: Filter<ChannelEvaluationFunction>[],
    ): boolean {
        let resultAccumulator = true;
        filters.forEach((filter) => {
            let result = null;
            if (filter.interpreter === 'javascript') result = filter.function(channel);
            resultAccumulator = resultAccumulator && result;
        });
        return resultAccumulator;
    }
}
