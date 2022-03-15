import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { LndChannel } from 'src/app/types/channels.interface';
import * as filterActions from '../../actions/filter.actions';
import { GraphFilterState } from '../../reducer';
import { FilterEvaluatorService } from '../../services/filter-evaluator.service';

@Component({
    selector: 'app-add-expression',
    templateUrl: './add-expression.component.html',
    styleUrls: ['./add-expression.component.scss'],
})
export class AddExpressionComponent {
    constructor(
        public filterEval: FilterEvaluatorService,
        private store$: Store<GraphFilterState>,
    ) {}

    public scriptLanguage: 'lnscript' | 'javascript' = 'javascript';
    public error: Error | undefined = undefined;
    public expression: string =
        this.scriptLanguage === 'javascript'
            ? `(channel) =>
    channel.capacity < 1000000 && 
    channel.policies.some(p => 
        p.public_key === 
        '03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f'
    )
`
            : undefined;
    public rpnExpression: string[];

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

    public jsFunction: Function = (channel) =>
        channel.capacity < 1000000 &&
        channel.policies.some(
            (p) =>
                p.public_key ===
                '03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f',
        );
    public source: string = this.expression;

    public expressionEval(input: string) {
        if (this.scriptLanguage == 'lnscript') {
            try {
                this.rpnExpression = this.filterEval.convertInfixExpressionToPostfix(input);
                this.filterEval.evaluateExpression(this.mockLndChannel, this.rpnExpression);
                this.error = undefined;
                this.source = input;
            } catch (e) {
                this.error = e;
            }
        }
        if (this.scriptLanguage === 'javascript') {
            try {
                this.jsFunction = eval(input);
                if (input.includes('console.log')) {
                    throw new Error('Should not have console.log');
                }
                if (typeof this.jsFunction(this.mockLndChannel) !== 'boolean')
                    throw new Error('Function must evaluate to boolean');
                this.error = undefined;
                this.source = input;
            } catch (e) {
                this.error = e;
            }
        }
    }

    public createExpression() {
        if (!this.error) {
            if (this.scriptLanguage === 'lnscript') {
                this.store$.dispatch(
                    filterActions.addFilter({
                        value: { interpreter: 'lnscript', expression: this.rpnExpression },
                    }),
                );
                console.log('adding valid expression: ', this.rpnExpression);
            }
            if (this.scriptLanguage === 'javascript') {
                console.log(this.jsFunction);
                this.store$.dispatch(
                    filterActions.addFilter({
                        value: {
                            interpreter: 'javascript',
                            function: this.jsFunction,
                            source: this.source,
                        },
                    }),
                );
            }
        }
    }
}
