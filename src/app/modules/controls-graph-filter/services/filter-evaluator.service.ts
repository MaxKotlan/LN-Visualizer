import { Injectable } from '@angular/core';
import { LndChannel } from 'api/src/models';

@Injectable({
    providedIn: 'root',
})
export class FilterEvaluatorService {
    constructor() {}

    public evaluateExpression(expression: string) {
        let stack: string[] = [];
        const tokens = expression.split(' ');
        tokens.forEach((token) => {
            if (this.isOperator(token)) {
                var rhs = Number.parseInt(stack.pop());
                var lhs = Number.parseInt(stack.pop());
                stack.push(
                    this.evaluate(
                        token as unknown as string,
                        lhs as unknown as number,
                        rhs as unknown as number,
                    ) as unknown as string,
                );
            } else {
                stack.push(token as unknown as string);
            }
        });
        const result = stack.pop();
        // if (result.length === 1) {
        console.log(result);
        // }
        // while (stack.length > 1) {
        //     console.log(stack.length);
        //     const token = stack[stack.length - 1];
        //     if (this.isOperator(token)) {
        //         const rhs = stack.pop();
        //         const lhs = stack.pop();
        //         stack.push(
        //             this.evaluate(
        //                 token,
        //                 lhs as unknown as number,
        //                 rhs as unknown as number,
        //             ) as unknown as string,
        //         );
        //     } else {
        //         stack.push(token);
        //     }
        // }
        //if (result !== typeof Boolean) throw new Error('Expression Must Evalue to Boolean');
    }

    public isOperator(token) {
        return (
            token === '/' ||
            token === '*' ||
            token === '-' ||
            token === '+' ||
            token === '>' ||
            token === '>=' ||
            token === '<' ||
            token === '<=' ||
            token === '!=' ||
            token === '=='
        );
    }

    // public evaluateFilters(channel: LndChannel, filters: Filter<number | string>[]): boolean {
    //     let result = true;
    //     filters.forEach((filter) => {
    //         result =
    //             result &&
    //             this.evaluate(
    //                 filter.operator,
    //                 this.keyToChannelValue(channel, filter.keyname),
    //                 filter.operand,
    //             );
    //     });
    //     return result;
    // }

    public keyToChannelValue(channel: LndChannel, key: string) {
        return channel[key] || channel.policies[0][key] || channel.policies[1][key];
    }

    protected evaluate(
        operator: string,
        lhs: number,
        rhs: number | string,
    ): boolean | number | string {
        switch (operator) {
            case '/':
                return lhs / (rhs as unknown as number);
            case '*':
                return lhs * (rhs as unknown as number);
            case '-':
                return lhs - (rhs as unknown as number);
            case '+':
                return lhs + (rhs as unknown as number);
            case '>':
                return lhs > rhs;
            case '>=':
                return lhs >= rhs;
            case '<':
                return lhs < rhs;
            case '<=':
                return lhs <= rhs;
            case '!=':
                return lhs != rhs;
            case '==':
                return lhs == rhs;
            case '&&':
                return lhs && rhs;
        }
        throw new Error('Unknown Operator in Filter Eval Function');
    }
}
