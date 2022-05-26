import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { displayUnit } from 'src/app/modules/controls-misc/selectors/misc-controls.selectors';

type UnitLabel = 'log' | 'linear' | 'sat' | 'btc';

export interface Unit {
    value: number;
    type: UnitLabel;
}

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
            'log': (x) => Math.round(Math.log10(x + 1)),
        },
        'sat': {
            'btc': (x) => 100000000 / x,
            'sat': (x) => x,
        },
        'btc': {
            'sat': (x) => x * 100000000,
            'btc': (x) => x,
        },
    };
}

@UntilDestroy()
@Injectable({
    providedIn: 'root',
})
export class CurrencyLogInputConverterService {
    constructor(private unitConverterService: UnitConverterService, private store$: Store<any>) {
        this.store$
            .select(displayUnit)
            .pipe(untilDestroyed(this))
            .subscribe((unit) => (this.displayUnit = unit as unknown as UnitLabel));
    }

    private displayUnit: UnitLabel;

    public forwardConvert(value: number): number {
        const a = this.unitConverterService.converter(
            { value, type: 'log' },
            'linear',
        ) as unknown as number;
        const b = this.unitConverterService.converter({ value: a, type: 'sat' }, this.displayUnit);
        return b as unknown as number;
    }

    public backwardsConvert(value: number): number {
        const a = this.unitConverterService.converter({ value, type: this.displayUnit }, 'sat');
        const b = this.unitConverterService.converter(
            { value: a as unknown as number, type: 'linear' },
            'log',
        ) as unknown as number;
        return b as unknown as number;
    }
}
