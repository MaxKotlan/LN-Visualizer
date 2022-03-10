import { Component, OnInit } from '@angular/core';
import { LndChannel } from 'src/app/types/channels.interface';
import { FilterEvaluatorService } from '../../services/filter-evaluator.service';

@Component({
    selector: 'app-add-expression',
    templateUrl: './add-expression.component.html',
    styleUrls: ['./add-expression.component.scss'],
})
export class AddExpressionComponent {
    constructor(public filterEval: FilterEvaluatorService) {}

    public error: Error | undefined = undefined;
    public expression: string;
    public rpnExpression: string[];

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
            console.log('adding valid expression: ', this.rpnExpression.join(''));
        }
    }
}
