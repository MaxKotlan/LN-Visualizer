import { Injectable } from '@angular/core';
import { MinMaxTotal } from 'src/app/types/min-max-total.interface';

@Injectable()
export class MinMaxControlValueService {
    public minMaxLinear: MinMaxTotal;
    public minLog = 0;
    public maxLog = 1;
    public logStep: number;
    public logValue: number[];

    public calculateMinMax(minMax: MinMaxTotal) {
        this.minMaxLinear = minMax;
        this.minLog = Math.log10(this.minMaxLinear.min + 1);
        this.maxLog = Math.log10(this.minMaxLinear.max + 1);
        this.logStep = (this.maxLog - this.minLog) / 100;
        this.logValue = [
            (this.maxLog - this.minLog) / 4 + this.minLog,
            (3 * (this.maxLog - this.minLog)) / 4 + this.minLog,
        ];
    }

    public updateValue(newVal, type: 'min' | 'max') {
        if (type === 'min') this.logValue[0] = Math.log10(newVal + 1);
        if (type === 'max') this.logValue[1] = Math.log10(newVal + 1);
    }
}
