import { Injectable, Pipe } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, filter, map, Subject } from 'rxjs';
import { displayUnit } from 'src/app/modules/controls-misc/selectors/misc-controls.selectors';

/*This file is terrible. I'm sorry I just wanted it to work*/

export type UnitLabel = 'log' | 'linear' | 'sat' | 'btc' | 'msat';

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
            'msat': (x) => x / 1000,
        },
        'btc': {
            'msat': (x) => x * 100000000000,
            'sat': (x) => x * 100000000,
            'btc': (x) => x,
        },
        'msat': {
            'msat': (x) => x,
            'sat': (x) => x * 1000,
            'btc': (x) => x * 100000000000,
        },
    };
}

export abstract class Converter {
    public abstract forwardConvert(value: number): number;
    public abstract backwardsConvert(value: number): number;
}

@UntilDestroy()
@Injectable({
    providedIn: 'root',
})
export class SatLogInputConverterService extends Converter {
    constructor(private unitConverterService: UnitConverterService, private store$: Store<any>) {
        super();
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

@UntilDestroy()
@Injectable({
    providedIn: 'root',
})
export class MilliSatLogInputConverterService extends Converter {
    constructor(private unitConverterService: UnitConverterService, private store$: Store<any>) {
        super();
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
        const b = this.unitConverterService.converter({ value: a, type: 'msat' }, this.displayUnit);
        return b as unknown as number;
    }

    public backwardsConvert(value: number): number {
        const a = this.unitConverterService.converter({ value, type: this.displayUnit }, 'msat');
        const b = this.unitConverterService.converter(
            { value: a as unknown as number, type: 'linear' },
            'log',
        ) as unknown as number;
        return b as unknown as number;
    }
}

@UntilDestroy()
@Injectable({
    providedIn: 'root',
})
export class NumberLogInputConverterService extends Converter {
    constructor(private unitConverterService: UnitConverterService) {
        super();
    }

    public forwardConvert(value: number): number {
        const a = this.unitConverterService.converter(
            { value, type: 'log' },
            'linear',
        ) as unknown as number;
        return a as unknown as number;
    }

    public backwardsConvert(value: number): number {
        const b = this.unitConverterService.converter(
            { value, type: 'linear' },
            'log',
        ) as unknown as number;
        return b as unknown as number;
    }
}

@Injectable({
    providedIn: 'root',
})
export class BaseConverterService {
    constructor(
        public satLogInputConverterService: SatLogInputConverterService,
        public milliSatLogInputConverterService: MilliSatLogInputConverterService,
        public numberLogInputConverterService: NumberLogInputConverterService,
    ) {}

    getConverter(baseUnit): Converter {
        if (baseUnit === 'number') {
            return this.numberLogInputConverterService;
        }
        if (baseUnit === 'sat') {
            return this.satLogInputConverterService;
        }
        if (baseUnit === 'msat') {
            return this.milliSatLogInputConverterService;
        }
    }
}

@Injectable({
    providedIn: 'root',
})
export class FinalConverterWrapper {
    constructor(private baseConverterService: BaseConverterService) {}

    private unitSubject$: BehaviorSubject<number> = new BehaviorSubject(NaN);
    private converterSubject$: BehaviorSubject<Converter> = new BehaviorSubject(undefined);

    public setBaseUnit(baseUnit) {
        const converter = this.baseConverterService.getConverter(baseUnit);
        this.converterSubject$.next(converter);
    }

    public setUnit(value: number) {
        this.unitSubject$.next(value[0]);
    }

    public forwardConvert$ = combineLatest([this.unitSubject$, this.converterSubject$]).pipe(
        filter(([unit, converter]) => !!unit && !!converter),
        map(([unit, converter]) => converter.forwardConvert(unit)),
    );

    public backwardsConvert$ = combineLatest([this.unitSubject$, this.converterSubject$]).pipe(
        filter(([unit, converter]) => !!unit && !!converter),
        map(([unit, converter]) => converter.backwardsConvert(unit)),
    );
}
