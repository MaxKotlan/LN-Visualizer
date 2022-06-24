import { Injectable } from '@angular/core';
import { LndChannel } from 'api/src/models';
import {
    ChannelEvaluationFunction,
    Filter,
} from '../../controls-graph-filter/types/filter.interface';
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
        capacity: 32,
        policies: [
            {
                public_key: '03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f',
            },
            {
                public_key: '033d8656219478701227199cbd6f670335c8d408a92ae88b962c49d4dc0e83e025',
            },
        ],
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
