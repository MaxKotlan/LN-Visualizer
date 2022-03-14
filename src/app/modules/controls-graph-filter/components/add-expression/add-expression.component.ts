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

    public error: Error | undefined = undefined;
    public expression: string;
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

    public expressionEval(input: string) {
        try {
            this.rpnExpression = this.filterEval.convertInfixExpressionToPostfix(input);
            this.filterEval.evaluateExpression(
                { capacity: 32 } as unknown as LndChannel,
                this.rpnExpression,
            );
            this.error = undefined;
        } catch (e) {
            this.error = e;
        }
    }

    public createExpression() {
        if (!this.error) {
            this.store$.dispatch(
                filterActions.addFilter({ value: { expression: this.rpnExpression } }),
            );
            console.log('adding valid expression: ', this.rpnExpression);
        }
    }
}
