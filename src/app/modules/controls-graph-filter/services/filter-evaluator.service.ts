import { Injectable } from '@angular/core';
import { LndChannel } from 'api/src/models';
import { Filter } from '../types/filter.interface';

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
            case 'policies':
                return 3;
            case '.':
                return 4;
        }
    }

    public convertInfixExpressionToPostfix(expression: string): string[] {
        let stack: string[] = [];
        let queue: string[] = [];

        let preParse = expression;

        this.arithmetics.forEach((op) => {
            preParse = preParse.replace(op, ` ${op} `);
        });

        const tokens = preParse
            .replace(/\s\s+/g, ' ')
            .split(/[\s()]+/g)
            .filter((x) => x !== '');

        // tokens.forEach((token, index) => {
        //     if (token.includes('.')) {
        //         const reverse = token.split('.').reverse().join('.');
        //     }
        // });

        console.log(tokens);
        tokens.forEach((token) => {
            if (!this.isValidToken(token)) throw new Error(`Invalid Token: ${token}`);
            if (this.isNumberOrChannelProperty(token)) {
                queue.push(token);
            }
            if (this.isOperator(token) || this.isChannelProperty(token)) {
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
        console.log(queue);
        return queue;
    }

    public evaluateExpression(channel: LndChannel, postFixExpression: string[]) {
        let stack: string[] = [];
        // console.log(postFixExpression);
        // postFixExpression = [
        //     'policies',
        //     '0',
        //     '.',
        //     'public_key',
        //     '.',
        //     '03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f',
        //     '=',
        //     'policies',
        //     '1',
        //     '.',
        //     'public_key',
        //     '.',
        //     '03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f',
        //     '=',
        //     '||',
        // ];
        // console.log(postFixExpression);
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

                if (this.isObjectOperator(token)) {
                    stack.push(this.evaluteObject(token, lhs, rhs) as unknown as string);
                }

                if (this.isArithmeticOperator(token)) {
                    stack.push(this.evaluteArithmetic(token, lhs, rhs) as unknown as string);
                }
                if (this.isComparatorOperator(token)) {
                    stack.push(this.evaluateLogical(token, lhs, rhs) as unknown as string);
                }
            } else {
                stack.push(token as unknown as string);
            }
        });
        const result = stack.pop();
        // console.log(result);
        if (stack.length != 0) throw new Error(`stack not empty. ${stack.length} items left`);
        if (typeof result !== 'boolean') throw new Error('does not evaluate to boolean');
        // console.log(result);
        return result;
    }

    public channelProperties = ['capacity', 'policies'];
    public objectOperators = ['.'];
    public arithmetics = ['/', '*', '-', '+'];
    public comparators = ['>', '>=', '<', '<=', '!=', '==', '=', '&&', '||'];

    public isValidToken(token) {
        return true;
        return (
            this.isChannelProperty(token) ||
            this.isOperator(token) ||
            !isNaN(Number(token)) ||
            token === '(' ||
            token === ')'
        );
    }

    protected isObjectOperator(operator: string) {
        return this.objectOperators.includes(operator);
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
        return (
            this.isComparatorOperator(token) ||
            this.isArithmeticOperator(token) ||
            this.isObjectOperator(token)
        );
    }

    public isNumberOrChannelProperty(token) {
        return !isNaN(Number(token)); // || token === 'public_key';
    }

    public evaluateFilters(channel: LndChannel, filters: Filter[]): boolean {
        let resultAccumulator = true;
        filters.forEach((filter) => {
            let result = null;
            if (filter.interpreter === 'lnscript')
                result = this.evaluateExpression(channel, filter.expression);
            if (filter.interpreter === 'javascript') result = filter.function(channel);
            resultAccumulator = resultAccumulator && result;
        });
        return resultAccumulator;
    }

    public keyToChannelValue(channel: LndChannel, key: string): string {
        return channel[key] || channel.policies[0][key] || channel.policies[1][key];
    }

    protected evaluteObject(operator: string, lhs: string, rhs: string) {
        switch (operator) {
            case '.':
                const result = lhs[rhs];
                if (!result) throw new Error('Invalid use of dot operator');
                return result;
        }
        throw new Error('Unknown Object Operator');
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
            case '||':
                return lhs || rhs;
        }
        throw new Error('Unknown logical operator');
    }
}
