import { Injectable } from '@angular/core';
import { LndChannel } from 'api/src/models';
import {
    ChannelEvaluationFunction,
    Filter,
} from '../../controls-graph-filter/types/filter.interface';
import { FilterFactory } from '../filter-factory';

@Injectable()
export class ChannelMinMaxFilter extends FilterFactory {
    public createFilter(
        channelProperty: string,
        minVal: number,
        maxVal: number,
    ): Filter<ChannelEvaluationFunction> {
        return {
            interpreter: 'javascript',
            issueId: `quick-${channelProperty}`,
            source: this.createChannelScriptSource(channelProperty, minVal, maxVal),
            function: this.createChannelScript(channelProperty, minVal, maxVal),
        };
    }

    protected createChannelScriptSource(channelProperty: string, minVal: number, maxVal: number) {
        return `return (channel) =>
channel.${channelProperty} >= ${minVal} && channel.${channelProperty} <= ${maxVal}                     
`;
    }

    protected createChannelScript(channelProperty: string, minVal: number, maxVal: number) {
        return (channel: LndChannel) =>
            channel[channelProperty] >= minVal && channel[channelProperty] <= maxVal;
    }
}
