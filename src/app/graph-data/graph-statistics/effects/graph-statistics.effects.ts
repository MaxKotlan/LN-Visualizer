import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filteredStatisticsSelector, globalStatisticsSelector } from '../selectors';
import { createEffect } from '@ngrx/effects';
import { filter, map, tap } from 'rxjs';
import { FilteredChannelRegistryService } from 'src/app/renderer/graph-renderer/services';
import { GraphStatisticsState } from '../models';
import { MinMaxTotal } from 'src/app/types/min-max-total.interface';

@Injectable()
export class GraphStatisticsEffects {
    saveControlsState$ = createEffect(
        () =>
            this.store$.select(filteredStatisticsSelector).pipe(
                filter(() => false),
                map((graphStatisticsState: GraphStatisticsState) => {
                    const capMinMax: MinMaxTotal = graphStatisticsState.capacity;
                    let sigmaSum = 0;
                    this.filteredChannelRegistry.forEach((channel) => {
                        const temp = channel.capacity - capMinMax.average;
                        sigmaSum = temp * temp;
                    });
                    const sigma = Math.sqrt(sigmaSum / capMinMax.count);
                    let min = Infinity;
                    let max = 0;
                    this.filteredChannelRegistry.forEach((channel) => {
                        sigmaSum +=
                            (channel.capacity - capMinMax.average) *
                            (channel.capacity - capMinMax.average);
                        channel['capacity_zscore'] = (channel.capacity - capMinMax.average) / sigma;
                        if (channel['capacity_zscore'] < min) min = channel['capacity_zscore'];
                        if (channel['capacity_zscore'] > max) max = channel['capacity_zscore'];
                    });
                    console.log('min', min, 'max', max);
                }),
            ),
        {
            dispatch: false,
        },
    );

    constructor(
        private store$: Store<any>,
        private filteredChannelRegistry: FilteredChannelRegistryService,
    ) {}
}
