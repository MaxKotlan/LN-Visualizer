import { Pipe, PipeTransform } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { displayUnit } from '../../settings/controls-misc/selectors/misc-controls.selectors';

@UntilDestroy()
@Pipe({
    name: 'unit',
})
export class UnitPipe implements PipeTransform {
    constructor(private store$: Store<any>) {
        this.store$
            .select(displayUnit)
            .pipe(untilDestroyed(this))
            .subscribe((unit) => (this.unit = unit));
    }

    public unit: 'btc' | 'mbtc' | 'sat';

    public readonly conversionFactor = {
        btc: 0.00000001,
        mbtc: 0.001,
        sat: 1,
    };

    transform(value: number): number {
        if (!this.unit) return value;
        return value * this.conversionFactor[this.unit];
    }
}
