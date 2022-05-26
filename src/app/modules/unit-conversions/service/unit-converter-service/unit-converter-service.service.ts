import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { displayUnit } from 'src/app/modules/controls-misc/selectors/misc-controls.selectors';

type UnitLabel = 'log' | 'linear' | 'sat' | 'btc';

export interface Unit {
    value: number;
    type: UnitLabel;
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
            'sat': (x) => 1,
        },
        'btc': {
            'sat': (x) => x / 10000000,
            'btc': (x) => 1,
        },
    };
}

@UntilDestroy()
@Injectable({
    providedIn: 'root',
})
export class InputConverterService {
    constructor(private unitConverterService: UnitConverterService, private store$: Store<any>) {
        this.store$
            .select(displayUnit)
            .pipe(untilDestroyed(this))
            .subscribe((unit) => (this.displayUnit = unit as unknown as UnitLabel));
    }

    private displayUnit: UnitLabel;

    public forwardConvert(value: number) {
        const a = this.unitConverterService.converter({ value, type: 'log' }, 'linear');
        const b = this.unitConverterService.converter({ value, type: 'sat' }, this.displayUnit);
    }

    public backwardsConvert(value: number) {
        const a = this.unitConverterService.converter({ value, type: 'log' }, 'linear');
        const b = this.unitConverterService.converter({ value, type: this.displayUnit }, 'sat');
    }
}
