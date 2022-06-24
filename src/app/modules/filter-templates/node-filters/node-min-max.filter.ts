import { Injectable } from '@angular/core';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import { Filter, NodeEvaluationFunction } from '../../controls-graph-filter/types/filter.interface';
import { FilterFactory } from '../filter-factory';

@Injectable()
export class NodeMinMaxFilter extends FilterFactory {
    public createFilter(
        nodeProperty: string,
        minVal: number,
        maxVal: number,
    ): Filter<NodeEvaluationFunction> {
        return {
            interpreter: 'javascript',
            issueId: `quick-${nodeProperty}`,
            source: this.createNodeScriptSource(nodeProperty, minVal, maxVal),
            function: this.createNodeScript(nodeProperty, minVal, maxVal),
        };
    }

    protected createNodeScriptSource(nodeProperty: string, minVal: number, maxVal: number) {
        return `return (node) =>
    node.${nodeProperty} >= ${minVal} && node.${nodeProperty} <= ${maxVal}                     
`;
    }

    protected createNodeScript(nodeProperty: string, minVal: number, maxVal: number) {
        return (node: LndNodeWithPosition) =>
            node[nodeProperty] >= minVal && node[nodeProperty] <= maxVal;
    }
}
