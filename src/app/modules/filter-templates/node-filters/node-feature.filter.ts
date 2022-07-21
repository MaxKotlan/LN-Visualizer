import { Injectable } from '@angular/core';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import { Filter, NodeEvaluationFunction } from '../../controls-graph-filter/types/filter.interface';
import { FilterFactory } from '../filter-factory';

@Injectable()
export class NodeFeatureFilter extends FilterFactory {
    public issueId = 'node-features';

    public createFilter(bitsDisabled: number[]): Filter<NodeEvaluationFunction> {
        return {
            interpreter: 'javascript',
            issueId: this.issueId,
            source: this.createNodeFeatureScriptSource(bitsDisabled),
            function: this.createNodeFeatureScript(bitsDisabled),
        };
    }

    protected createNodeFeatureScriptSource(bitsDisabled: number[]) {
        return `const disabledFeatures = [${bitsDisabled.join(', ')}];
return (node) =>
    node.features.some((feature) => !disabledFeatures.includes(feature.bit));`;
    }

    protected createNodeFeatureScript(bitsDisabled: number[]) {
        return (node: LndNodeWithPosition) =>
            node.features.some((feature) => !bitsDisabled.includes(feature.bit));
    }
}
