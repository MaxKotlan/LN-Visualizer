import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LndChannel } from 'api/src/models';
import { MinMaxTotal } from 'src/app/types/min-max-total.interface';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import * as globalStatisticActions from '../../actions/global-statistics.actions';
import { GraphStatisticsState } from '../../models';
import { globalStatisticsSelector } from '../../selectors';
import { updateCurrentMinMaxTotalStats } from '../../utils';

@Injectable({
    providedIn: 'root',
})
export class GlobalStatisticsCalculatorService {
    constructor(private store$: Store<GraphStatisticsState>) {
        this.store$.select(globalStatisticsSelector).subscribe((currentState) => {
            this.currentStatisticsState = currentState;
            this.keysToCheck = Object.keys(this.currentStatisticsState);
        });
    }

    //probably will cause issues because not using withLatestFrom in graph effect
    public keysToCheck: string[];
    public currentStatisticsState: GraphStatisticsState;

    public checkNode(node: LndNodeWithPosition) {
        this.keysToCheck.forEach((property) => {
            if (node[property]) {
                this.currentStatisticsState[property] = updateCurrentMinMaxTotalStats(
                    this.currentStatisticsState[property],
                    node[property],
                ) as MinMaxTotal;
            }
        });
    }

    public checkChannel(channel: LndChannel) {
        this.keysToCheck.forEach((property) => {
            if (channel[property] !== undefined) {
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
        this.store$.dispatch(
            globalStatisticActions.updateAllGlobalMinMaxStatistic({
                newState: this.currentStatisticsState,
            }),
        );
    }
}
