import { Injectable } from '@angular/core';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import {
    Filter,
    NodeEvaluationFunction,
} from 'src/app/filter-engine/controls-graph-filter/types/filter.interface';
import { FilterFactory } from '../filter-factory';

@Injectable()
export class NodeNetworkFilter extends FilterFactory {
    public issueId = 'node-network';

    public createFilter(channelType: string): Filter<NodeEvaluationFunction> {
        return {
            interpreter: 'javascript',
            issueId: this.issueId,
            source: this.createNodeNetworkScriptSource(channelType),
            function: this.createNodeNetworkScript(channelType),
        };
    }

    protected createNodeNetworkScriptSource(networkType: string) {
        switch (networkType) {
            case 'Clearnet Only':
                return `return (node) =>
    node.sockets.every((s) => !s.includes('.onion'));`;
            case 'Tor Only':
                return `return (node) =>
    node.sockets.every((s) => s.includes('.onion'));`;
            case 'Has Clearnet':
                return `return (node) =>
    node.sockets.some((s) => !s.includes('.onion'));`;
            case 'Has Onion Address':
                return `return (node) =>
    node.sockets.some((s) => s.includes('.onion'));`;
        }
    }

    protected createNodeNetworkScript(networkType: string) {
        switch (networkType) {
            case 'Clearnet Only':
                return (node: LndNodeWithPosition) =>
                    node.sockets.every((s) => !s.includes('.onion'));
            case 'Tor Only':
                return (node: LndNodeWithPosition) =>
                    node.sockets.every((s) => s.includes('.onion'));
            case 'Has Clearnet':
                return (node: LndNodeWithPosition) =>
                    node.sockets.some((s) => !s.includes('.onion'));
            case 'Has Onion Address':
                return (node: LndNodeWithPosition) =>
                    node.sockets.some((s) => s.includes('.onion'));
        }
    }
}
