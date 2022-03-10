import { Injectable } from '@angular/core';
import { LndChannel } from 'api/src/models';

@Injectable({
    providedIn: 'root',
})
export class FilterEvaluatorService {
    constructor() {}

    public evaluateExpression(channel: LndChannel, expression: string) {
        let stack: string[] = [];
        const tokens = expression
            .replace(/\s\s+/g, ' ')
            .split(' ')
            .filter((x) => x !== '');
        // console.log(tokens);
        tokens.forEach((token) => {
            if (!this.isValidToken(token)) throw new Error(`Invalid Token: ${token}`);
            if (this.isOperator(token)) {
                if (stack.length < 2) throw new Error(`Operator not in correct order: ${token}`);

                let rhs = stack.pop();
                let lhs = stack.pop();

                if (this.isChannelProperty(lhs) || this.isChannelProperty(rhs)) {
                    if (this.isChannelProperty(lhs)) lhs = channel[lhs];
                    if (this.isChannelProperty(rhs)) rhs = channel[rhs];
                }

                if (this.isArithmeticOperator(token)) {
                    stack.push(this.evaluteArithmetic(token, lhs, rhs) as unknown as string);
                } else {
                    stack.push(this.evaluateLogical(token, lhs, rhs) as unknown as string);
                }
            } else {
                stack.push(token as unknown as string);
            }
        });
        if (stack.length != 1) throw new Error(`stack not empty ${stack.length}`);
        const result = stack.pop();
        if (typeof result !== 'boolean') throw new Error('does not evaluate to boolean');
        //   throw new Error(`Unknown Token ${lhs} ${rhs}`);

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

    public channelProperties = ['capacity', 'fee_rate'];
    public arithmetics = ['/', '*', '-', '+'];
    public comparators = ['>', '>=', '<', '<=', '!=', '=='];

    public isValidToken(token) {
        return this.isChannelProperty(token) || this.isOperator(token) || !isNaN(Number(token));
    }

    public isChannelProperty(token) {
        return this.channelProperties.includes(token);
    }

    public isComparatorOperator(token) {
        return this.comparators.includes(token);
    }

    public isArithmeticOperator(token) {
        return this.arithmetics.includes(token);
    }

    public isOperator(token) {
        return this.isComparatorOperator(token) || this.arithmetics.includes(token);
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

    protected evaluteArithmetic(operator: string, lhs: string, rhs: string) {
        let lhsNumber = Number(lhs);
        let rhsNumber = Number(rhs);

        if (this.isChannelProperty(lhs) || this.isChannelProperty(rhs))
            return `${lhs} ${operator} ${lhs}`;

        if (isNaN(lhsNumber)) throw new Error(`${lhs} is not a number`);
        if (isNaN(rhsNumber)) throw new Error(`${rhs} is not a number`);

        switch (operator) {
            case '/':
                return lhsNumber / rhsNumber;
            case '*':
                return lhsNumber * rhsNumber;
            case '-':
                return lhsNumber - rhsNumber;
            case '+':
                return lhsNumber + rhsNumber;
        }
        throw new Error('Unknown Arithmetic Operator');
    }

    protected evaluateLogical(
        operator: string,
        lhs: string,
        rhs: string,
    ): boolean | number | string {
        switch (operator) {
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
