import { Injectable } from '@angular/core';
import { Filter, NodeEvaluationFunction } from '../../controls-graph-filter/types/filter.interface';
import { FilterFactory } from '../filter-factory';

@Injectable()
export class GenericNodeFilter extends FilterFactory {
    public async createFilter(sourceCode: string): Promise<Filter<NodeEvaluationFunction>> {
        return {
            interpreter: 'javascript',
            source: sourceCode,
            function: await this.expressionEval(sourceCode),
        };
    }

    protected readonly mockLndNode = {
        'alias': 'lnvisualizer.com',
        'color': '#f2a900',
        'features': [
            {
                'bit': 0,
                'is_known': true,
                'is_required': true,
                'type': 'data_loss_protection',
            },
            {
                'bit': 5,
                'is_known': true,
                'is_required': false,
                'type': 'upfront_close_script',
            },
            {
                'bit': 7,
                'is_known': true,
                'is_required': false,
                'type': 'gossip_queries_v1',
            },
            {
                'bit': 9,
                'is_known': true,
                'is_required': false,
                'type': 'tlv_onion',
            },
            {
                'bit': 12,
                'is_known': true,
                'is_required': true,
                'type': 'static_remote_key',
            },
            {
                'bit': 14,
                'is_known': true,
                'is_required': true,
                'type': 'payment_identifier',
            },
            {
                'bit': 17,
                'is_known': true,
                'is_required': false,
                'type': 'multipath_payments_v0',
            },
            {
                'bit': 23,
                'is_known': true,
                'is_required': false,
                'type': 'anchor_zero_fee_htlc_tx',
            },
            {
                'bit': 31,
                'is_known': true,
                'is_required': false,
            },
            {
                'bit': 45,
                'is_known': true,
                'is_required': false,
            },
            {
                'bit': 2023,
                'is_known': true,
                'is_required': false,
            },
        ],
        'public_key': '02159f4a5a9204cceb648e7a051864fafb1b42d7e4a09102e6667bb726618c80a0',
        'sockets': ['gyyihhc3cfjdlmdchh6lv7ezfh5b35x4xa5tcxegpypwk5sdpsqci3qd.onion:9735'],
        'updated_at': '2022-06-23T16:03:37.000Z',
        'buffer_index': 8972,
        'position': {
            'x': -0.002028837228832091,
            'y': 0.01891024548163137,
            'z': 0.05764926317877739,
        },
        'connected_channels': {},
        'node_capacity': 70721795,
        'channel_count': 48,
    };

    public async expressionEval(sourceCode: string) {
        const evaluatedSourceCode = await eval(`(async () => { ${sourceCode} })()`);
        if (typeof evaluatedSourceCode !== 'function')
            throw new Error('Script must return a function');
        if (typeof evaluatedSourceCode(this.mockLndNode) !== 'boolean')
            throw new Error('Function must evaluate to boolean');
        return evaluatedSourceCode;
    }
}
