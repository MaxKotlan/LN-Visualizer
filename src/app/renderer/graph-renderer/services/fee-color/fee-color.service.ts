import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { selectMinMaxFiltered } from 'src/app/graph-data/graph-statistics/selectors';
import { MinMaxTotal } from 'src/app/types/min-max-total.interface';
import { ChannelControlState } from 'src/app/ui/settings/controls-channel/reducers';
import {
    channelColorMapRgb,
    channelColorToStat,
} from 'src/app/ui/settings/controls-channel/selectors';

@UntilDestroy()
@Injectable({
    providedIn: 'root',
})
export class FeeColorService {
    constructor(private store$: Store<ChannelControlState>) {
        this.store$
            .select(channelColorMapRgb)
            .pipe(untilDestroyed(this))
            .subscribe((arr) => (this.colorArray = arr));

        this.store$
            .select(channelColorToStat)
            .pipe(
                switchMap((propName) => this.store$.select(selectMinMaxFiltered(propName))),
                untilDestroyed(this),
            )
            .subscribe((minMax) => (this.minMaxCap = minMax));
    }

    private colorArray: number[][];
    private minMaxCap: MinMaxTotal;

    public getColorMap(useLogColorScale, fee_rateA: number, fee_rateB: number) {
        const [n1, n2] = this.getNormalizedValues(useLogColorScale, fee_rateA, fee_rateB);

        const ci1 = Math.floor(n1 * 499);
        const ci2 = Math.floor(n2 * 499);

        const a = Number.isNaN(ci1) ? [0, 0, 0] : this.colorArray[ci1];
        const b = Number.isNaN(ci2) ? [0, 0, 0] : this.colorArray[ci2];
        return [...a, ...b];
    }

    public getNormalizedValues(useLogColorScale, fee_rateA: number, fee_rateB: number) {
        const normalizedValue1 = useLogColorScale
            ? this.LogNormalizedValue(fee_rateA)
            : this.LinearNormalizedValue(fee_rateA);

        const normalizedValue2 = useLogColorScale
            ? this.LogNormalizedValue(fee_rateB)
            : this.LinearNormalizedValue(fee_rateB);

        return [normalizedValue1, normalizedValue2];
    }

    private LogNormalizedValue(fee_rate: number) {
        const maxLog = Math.log10(this.minMaxCap.max + 1);
        const minLog = Math.log10(this.minMaxCap.min + 1);
        const capLog = Math.log10(fee_rate + 1);
        const minMaxRange = maxLog - minLog;
        if (minMaxRange === 0) return 0;
        return (capLog - minLog) / minMaxRange;
    }

    private LinearNormalizedValue(fee_rate: number) {
        const minMaxRange = this.minMaxCap.max - this.minMaxCap.min;
        if (minMaxRange === 0) return 0;
        return (fee_rate - this.minMaxCap.min) / (this.minMaxCap.max - this.minMaxCap.min);
    }
}
