import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LndChannel } from 'api/src/models';
import { MinMax, MinMaxTotal } from 'src/app/types/min-max-total.interface';
import { GraphStatisticsState } from '../../reducer/graph-statistics.reducer';
import { selectChannelFeesMinMaxTotal, selectChannelMinMaxTotal } from '../../selectors';
import { updateCurrentMinMaxTotalStats } from '../../utils';
import * as graphStatisticActions from '../../actions/graph-statistics.actions';

@Injectable({
    providedIn: 'root',
})
export class MinMaxCalculatorService {
    constructor(private store$: Store<GraphStatisticsState>) {
        this.store$
            .select(selectChannelMinMaxTotal)
            .subscribe((currentMax) => (this.currentCapacityMinMaxTotalState = currentMax));
        this.store$
            .select(selectChannelFeesMinMaxTotal)
            .subscribe((currentMax) => (this.currentFeeMinMaxTotalState = currentMax));
    }

    //probably will cause issues because not using withLatestFrom in graph effect
    public currentCapacityMinMaxTotalState: MinMaxTotal;
    public currentFeeMinMaxTotalState: MinMax;

    public checkChannel(channel: LndChannel) {
        this.currentCapacityMinMaxTotalState = updateCurrentMinMaxTotalStats(
            this.currentCapacityMinMaxTotalState,
            channel.capacity,
        ) as MinMaxTotal;
        this.currentFeeMinMaxTotalState = updateCurrentMinMaxTotalStats(
            this.currentFeeMinMaxTotalState,
            channel.policies[0].fee_rate,
        );
    }

    public updateStore() {
        this.store$.dispatch(
            graphStatisticActions.setChannelCapacityMinMax({
                channelCap: this.currentCapacityMinMaxTotalState,
            }),
        );
        this.store$.dispatch(
            graphStatisticActions.setChannelFeesMinMax({
                channelFees: this.currentFeeMinMaxTotalState,
            }),
        );
    }
}
