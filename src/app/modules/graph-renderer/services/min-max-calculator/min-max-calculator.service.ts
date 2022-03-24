import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LndChannel } from 'api/src/models';
import { MinMaxTotal } from 'src/app/types/min-max-total.interface';
import * as graphStatisticActions from '../../actions/graph-statistics.actions';
import { GraphStatisticsState } from '../../reducer/graph-statistics.reducer';
import { graphStatisticsSelector } from '../../selectors';
import { updateCurrentMinMaxTotalStats } from '../../utils';

@Injectable({
    providedIn: 'root',
})
export class MinMaxCalculatorService {
    constructor(private store$: Store<GraphStatisticsState>) {
        this.store$.select(graphStatisticsSelector).subscribe((currentState) => {
            this.currentStatisticsState = currentState;
            this.keysToCheck = Object.keys(this.currentStatisticsState);
        });
    }

    //probably will cause issues because not using withLatestFrom in graph effect
    public keysToCheck: string[];
    public currentStatisticsState: GraphStatisticsState;

    public checkChannel(channel: LndChannel) {
        this.keysToCheck.forEach((property) => {
            if (channel[property]) {
                this.currentStatisticsState[property] = updateCurrentMinMaxTotalStats(
                    this.currentStatisticsState[property],
                    channel[property],
                ) as MinMaxTotal;
            } else {
                channel.policies.forEach((p) => {
                    this.currentStatisticsState[property] = updateCurrentMinMaxTotalStats(
                        this.currentStatisticsState[property],
                        p[property],
                    ) as MinMaxTotal;
                });
            }
        });
    }

    public updateStore() {
        this.keysToCheck.forEach((property: keyof GraphStatisticsState) => {
            this.store$.dispatch(
                graphStatisticActions.updateMinMaxStatistic({
                    property,
                    newStatState: this.currentStatisticsState[property],
                }),
            );
        });
    }
}
