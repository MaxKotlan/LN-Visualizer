import { Injectable } from '@angular/core';
import { LndChannel } from 'api/src/models';
import {
    ChannelEvaluationFunction,
    Filter,
} from 'src/app/filter-engine/controls-graph-filter/types/filter.interface';
import { FilterFactory } from '../filter-factory';

@Injectable()
export class GenericChannelFilter extends FilterFactory {
    public async createFilter(sourceCode: string): Promise<Filter<ChannelEvaluationFunction>> {
        return {
            interpreter: 'javascript',
            source: sourceCode,
            function: await this.expressionEval(sourceCode),
        };
    }

    protected readonly mockLndChannel = {
        'id': '714127x882x1',
        'capacity': 503347,
        'policies': [
            {
                'base_fee_mtokens': '0',
                'cltv_delta': 40,
                'fee_rate': 100,
                'is_disabled': false,
                'max_htlc_mtokens': '498314000',
                'min_htlc_mtokens': '1000',
                'public_key': '02159f4a5a9204cceb648e7a051864fafb1b42d7e4a09102e6667bb726618c80a0',
                'updated_at': '2022-06-24T08:56:16.000Z',
            },
            {
                'base_fee_mtokens': '1000',
                'cltv_delta': 40,
                'fee_rate': 1,
                'is_disabled': false,
                'max_htlc_mtokens': '498314000',
                'min_htlc_mtokens': '1000',
                'public_key': '0364356cf136034814e9f7a0c542286d65d94b20c72afaca9cfb1811656de609b8',
                'updated_at': '2022-06-22T20:39:36.000Z',
            },
        ],
        'transaction_id': '071325915315d80da1986905c0dc9c62d2784c6d9ad557151bde0d7e7f90a0cb',
        'transaction_vout': 1,
        'updated_at': '2022-06-24T08:56:16.000Z',
    } as LndChannel;

    public async expressionEval(sourceCode: string) {
        const evaluatedSourceCode = await eval(`(async () => { ${sourceCode} })()`);
        if (typeof evaluatedSourceCode !== 'function')
            throw new Error('Script must return a function');
        if (typeof evaluatedSourceCode(this.mockLndChannel) !== 'boolean')
            throw new Error('Function must evaluate to boolean');
        return evaluatedSourceCode;
    }
}
