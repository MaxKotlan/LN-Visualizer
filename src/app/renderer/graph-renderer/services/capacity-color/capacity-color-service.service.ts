import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { selectChannelMinMaxTotal } from 'src/app/graph-data/graph-statistics/selectors';
import { MinMaxTotal } from 'src/app/types/min-max-total.interface';
import { ChannelControlState } from 'src/app/ui/settings/controls-channel/reducers';
import { channelColorMapRgb } from 'src/app/ui/settings/controls-channel/selectors';

@UntilDestroy()
@Injectable({
    providedIn: 'root',
})
export class CapacityColorServiceService {
    constructor(private store$: Store<ChannelControlState>) {
        this.store$
            .select(channelColorMapRgb)
            .pipe(untilDestroyed(this))
            .subscribe((arr) => (this.colorArray = arr));

        this.store$
            .select(selectChannelMinMaxTotal)
            .pipe(untilDestroyed(this))
            .subscribe((minMax) => (this.minMaxCap = minMax));
    }

    private colorArray: number[][];
    private minMaxCap: MinMaxTotal;

    public getColorMap(useLogColorScale, capacity: number) {
        const normalizedValue = useLogColorScale
            ? this.LogNormalizedValue(capacity)
            : this.LinearNormalizedValue(capacity);

        const toColorIndex = Math.floor(normalizedValue * 499);
        return [...this.colorArray[toColorIndex], ...this.colorArray[toColorIndex]];
    }

    private LogNormalizedValue(capacity: number) {
        const maxLog = Math.log10(this.minMaxCap.max + 1);
        const minLog = Math.log10(this.minMaxCap.min + 1);
        const capLog = Math.log10(capacity + 1);
        const minMaxRange = maxLog - minLog;
        if (minMaxRange === 0) return 0;
        return (capLog - minLog) / minMaxRange;
    }

    private LinearNormalizedValue(capacity: number) {
        const minMaxRange = this.minMaxCap.max - this.minMaxCap.min;
        if (minMaxRange === 0) return 0;
        return (capacity - this.minMaxCap.min) / (this.minMaxCap.max - this.minMaxCap.min);
    }
}
