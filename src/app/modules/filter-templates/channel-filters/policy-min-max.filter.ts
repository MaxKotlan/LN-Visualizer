import { Injectable } from '@angular/core';
import { LndChannel } from 'api/src/models';
import {
    ChannelEvaluationFunction,
    Filter,
} from '../../controls-graph-filter/types/filter.interface';
import { FilterFactory } from '../filter-factory';

@Injectable()
export class PolicyMinMaxFilter extends FilterFactory {
    public createFilter(
        policyProperty: string,
        minVal: number,
        maxVal: number,
    ): Filter<ChannelEvaluationFunction> {
        return {
            interpreter: 'javascript',
            issueId: `quick-${policyProperty}`,
            source: this.createPolicyScriptSource(policyProperty, minVal, maxVal),
            function: this.createPolicyScript(policyProperty, minVal, maxVal),
        };
    }

    protected createPolicyScriptSource(policyProperty: string, minVal: number, maxVal: number) {
        return `return (channel) =>
  channel.policies.some(p =>
    p.${policyProperty} >= ${minVal} && p.${policyProperty} <= ${maxVal} )                        
`;
    }

    protected createPolicyScript(policyProperty: string, minVal: number, maxVal: number) {
        return (channel: LndChannel) =>
            channel.policies.some(
                (p) => p[policyProperty] >= minVal && p[policyProperty] <= maxVal,
            );
    }
}
