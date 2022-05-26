import { Injectable } from '@angular/core';

type UnitLabel = 'log' | 'linear' | 'sat' | 'btc';

export interface Unit {
    value: number;
    type: UnitLabel;
    base: 1;
}

export interface UnitMap {}

@Injectable({
    providedIn: 'root',
})
export class UnitConverterService {
    public converter(from: Unit, to: UnitLabel): Unit {
        return this.convertFrom[from.type][to](from.value);
    }

    public readonly convertFrom = {
        'log': {
            'linear': (x) => Math.round(Math.pow(10, x) - 1),
        },
        'linear': {
            'log': (x) => Math.log10(x + 1),
        },
        'sat': {
            'btc': (x) => 10000000 / x,
        },
        'btc': {
            'sat': (x) => x / 10000000,
        },
    };
}
