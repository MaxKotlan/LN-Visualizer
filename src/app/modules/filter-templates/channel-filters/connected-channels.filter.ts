import { Injectable } from '@angular/core';
import { LndChannel } from 'api/src/models';
import {
    ChannelEvaluationFunction,
    Filter,
} from '../../controls-graph-filter/types/filter.interface';
import { FilterFactory } from '../filter-factory';

@Injectable()
export class ConnectedChannelsFilter extends FilterFactory {
    public createFilter(node_public_key: string): Filter<ChannelEvaluationFunction> {
        return {
            interpreter: 'javascript',
            source: `return (channel) => 
channel.policies.some((p) => 
p.public_key === "${node_public_key}")
`.trim(),
            function: (channel: LndChannel) =>
                channel.policies.some((p) => p.public_key === node_public_key),
            issueId: 'addNodeFilter',
        };
    }
}
