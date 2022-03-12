import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { Filter } from 'src/app/modules/controls-graph-filter/types/filter.interface';
import { GraphState } from 'src/app/modules/graph-renderer/reducer';
import * as filterActions from '../../../controls-graph-filter/actions';

@Component({
    selector: 'app-quick-capacity',
    templateUrl: './quick-capacity.component.html',
    styleUrls: ['./quick-capacity.component.scss'],
})
export class QuickCapacityComponent {
    constructor(private store$: Store<GraphState>) {}

    public isEnabled: boolean;
    public capacityAmount: number;

    public max = Number(1400000000);
    public maxLog = Math.log10(this.max);
    public step = this.maxLog / 100;
    public value = this.maxLog / 2;

    enableCapacityChange() {
        if (!this.isEnabled) {
            this.store$.dispatch(
                filterActions.removeFilterByIssueId({ issueId: 'quick-capacity' }),
            );
        } else {
            filterActions.updateFilterByIssueId({
                value: {
                    issueId: 'quick-capacity',
                    expression: ['capacity', this.capacityAmount, '>'],
                } as Filter,
            });
        }
    }

    updateQuickCapacityFiliterScript(event: MatSliderChange) {
        this.isEnabled = true;
        this.store$.dispatch(
            filterActions.updateFilterByIssueId({
                value: {
                    issueId: 'quick-capacity',
                    expression: ['capacity', Math.pow(10, event.value), '>'],
                } as Filter,
            }),
        );
    }
}
