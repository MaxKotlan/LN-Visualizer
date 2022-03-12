import { Component, OnInit } from '@angular/core';
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

    updateQuickCapacityFiliterScript(event: MatSliderChange) {
        this.store$.dispatch(
            filterActions.updateFilterByIssueId({
                value: {
                    issueId: 'quick-capacity',
                    expression: ['capacity', event.value || 1, '>'],
                } as Filter,
            }),
        );
    }
}
