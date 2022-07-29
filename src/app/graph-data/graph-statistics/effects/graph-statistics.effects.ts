import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { FilteredChannelRegistryService } from 'src/app/graph-data/data-registries/services';
import { MinMaxTotal } from 'src/app/types/min-max-total.interface';
import { GraphStatisticsState } from '../models';
import { filteredStatisticsSelector } from '../selectors';

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
