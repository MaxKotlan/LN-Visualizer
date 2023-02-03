import { Injectable } from '@angular/core';
import {
    ChannelMinMaxFilter,
    NodeMinMaxFilter,
    PolicyMinMaxFilter,
} from 'src/app/filter-engine/filter-templates';
import * as filterActions from 'src/app/filter-engine/controls-graph-filter/actions';
import { GraphState } from 'src/app/renderer/graph-renderer/reducer';
import { Store } from '@ngrx/store';

@Injectable({
    providedIn: 'root',
})
export class ScriptManagerService {
    constructor(
        public store$: Store<GraphState>,
        private policyMinMaxFilter: PolicyMinMaxFilter,
        private channelMinMaxFilter: ChannelMinMaxFilter,
        private nodeMinMaxFilter: NodeMinMaxFilter,
    ) {}

    public updateNodeScript(scriptKey, lowerVal, upperVal) {
        this.store$.dispatch(
            filterActions.updateNodeFilterByIssueId({
                value: this.nodeMinMaxFilter.createFilter(
                    scriptKey,
                    this.logToLinear(lowerVal),
                    this.logToLinear(upperVal),
                ),
            }),
        );
    }

    public updateChannelScript(scriptKey, lowerVal, upperVal, isPolicy) {
        this.store$.dispatch(
            filterActions.updateChannelFilterByIssueId({
                value: isPolicy
                    ? this.policyMinMaxFilter.createFilter(
                          scriptKey,
                          this.logToLinear(lowerVal),
                          this.logToLinear(upperVal),
                      )
                    : this.channelMinMaxFilter.createFilter(
                          scriptKey,
                          this.logToLinear(lowerVal),
                          this.logToLinear(upperVal),
                      ),
            }),
        );
    }

    public logToLinear(value: number) {
        return Math.round(Math.pow(10, value) - 1);
    }
}
