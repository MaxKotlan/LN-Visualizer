import {
    ChannelEvaluationFunction,
    Filter,
    NodeEvaluationFunction,
} from '../controls-graph-filter/types/filter.interface';

export abstract class FilterFactory {
    public abstract createFilter(
        ...params: any
    ):
        | Filter<ChannelEvaluationFunction | NodeEvaluationFunction>
        | Promise<Filter<ChannelEvaluationFunction | NodeEvaluationFunction>>;
}
