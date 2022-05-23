import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'logToLinear',
})
export class LogToLinearPipe implements PipeTransform {
    transform(value: number): number {
        if (Number.isNaN(value)) return NaN;
        return Math.round(Math.pow(10, value) - 1);
    }
}
