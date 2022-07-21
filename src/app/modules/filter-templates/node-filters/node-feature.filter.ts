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

    protected createNodeFeatureScriptSource(bitsEnabled: number[]) {
        return `const enabledFeatureBits = [${bitsEnabled.join(', ')}];
return (node) =>
    node.features.some((feature) => enabledFeatureBits.includes(feature.bit));`;
    }

    protected createNodeFeatureScript(bitsEnabled: number[]) {
        return (node: LndNodeWithPosition) =>
            node.features.some((feature) => bitsEnabled.includes(feature.bit));
    }
}
