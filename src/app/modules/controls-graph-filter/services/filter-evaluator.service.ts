import { Injectable } from '@angular/core';
import { LndChannel } from 'api/src/models';

@Injectable({
    providedIn: 'root',
})
export class FilterEvaluatorService {
    constructor() {}

    protected prescedence(operator: string) {
        if (this.isComparatorOperator(operator)) return 0;
        switch (operator) {
            case '+':
                return 1;
            case '-':
                return 1;
            case '*':
                return 2;
            case '/':
                return 2;
        }
    }

    public convertInfixExpressionToPostfix(expression: string): string[] {
        let stack: string[] = [];
        let queue: string[] = [];
        const tokens = expression
            .replace(/\s\s+/g, ' ')
            .split(' ')
            .filter((x) => x !== '');
        // console.log(tokens);
        tokens.forEach((token) => {
            if (!this.isValidToken(token)) throw new Error(`Invalid Token: ${token}`);
            if (this.isNumberOrChannelProperty(token)) {
                queue.push(token);
            }
            if (this.isOperator(token)) {
                while (this.prescedence(token) < this.prescedence(stack[stack.length - 1])) {
                    queue.push(stack.pop());
                }
                stack.push(token);
            }
            if (this.isComparatorOperator(token)) {
                // while (this.isComparatorOperator(stack[stack.length - 1]) && stack.length > 0) {
                //     queue.push(stack.pop());
                // }
                // //stack.pop();
            }
            if (token === '(') {
                stack.push(token);
            }
            if (token === ')') {
                while (stack[stack.length - 1] !== '(' && stack.length > 0) {
                    queue.push(stack.pop());
                }
                stack.pop();
            }
        });
        stack.forEach((item) => queue.push(item));
        return queue;
    }

    public evaluateExpression(channel: LndChannel, postFixExpression: string[]) {
        let stack: string[] = [];
        console.log(postFixExpression);
        postFixExpression.forEach((token) => {
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
        const result = stack.pop();
        if (stack.length != 0) throw new Error(`stack not empty. ${stack.length} items left`);
        if (typeof result !== 'boolean') throw new Error('does not evaluate to boolean');
        console.log(result);
        return result;
    }

    public channelProperties = ['capacity', 'fee_rate'];
    public arithmetics = ['/', '*', '-', '+'];
    public comparators = ['>', '>=', '<', '<=', '!=', '==', '='];

    public isValidToken(token) {
        return (
            this.isChannelProperty(token) ||
            this.isOperator(token) ||
            !isNaN(Number(token)) ||
            token === '(' ||
            token === ')'
        );
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

    public isNumberOrChannelProperty(token) {
        return this.isChannelProperty(token) || !isNaN(Number(token));
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
            case '=':
                return lhs == rhs;
            case '==':
                return lhs == rhs;
            case '&&':
                return lhs && rhs;
        }
        throw new Error('Unknown logical operator');
    }
}
