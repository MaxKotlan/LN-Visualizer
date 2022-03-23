import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Filter } from 'src/app/modules/controls-graph-filter/types/filter.interface';
import { GraphState } from 'src/app/modules/graph-renderer/reducer';
import { LndChannel } from 'src/app/types/channels.interface';
import * as filterActions from '../../../controls-graph-filter/actions';
import * as filterSelectors from '../../../controls-graph-filter/selectors/filter.selectors';

@Component({
    selector: 'app-quick-capacity',
    templateUrl: './quick-capacity.component.html',
    styleUrls: ['./quick-capacity.component.scss'],
})
export class QuickCapacityComponent {
    constructor(private store$: Store<GraphState>) {}

    public isEnabled: boolean;

    public max = Number(1400000000);
    public maxLog = Math.log10(this.max);
    public step = this.maxLog / 100;
    public value = this.maxLog / 2;

    public capacityAmount: number = this.maxLog / 2;

    public isEnabled$: Observable<boolean> = this.store$.select(
        filterSelectors.isFilterActive('quick-capacity'),
    );

    enableCapacityChange() {
        if (!this.isEnabled) {
            this.store$.dispatch(
                filterActions.removeChannelFilterByIssueId({ issueId: 'quick-capacity' }),
            );
        } else {
            this.store$.dispatch(
                filterActions.updateChannelFilterByIssueId({
                    value: {
                        interpreter: 'javascript',
                        source: `return (channel) =>
    channel.capacity > ${Math.pow(10, this.capacityAmount)}                            
`,
                        function: (channel: LndChannel) =>
                            channel.capacity > Math.pow(10, this.capacityAmount),
                        issueId: 'quick-capacity',
                    } as Filter,
                }),
            );
        }
    }

    updateQuickCapacityFiliterScript(event: MatSliderChange) {
        this.isEnabled = true;
        this.store$.dispatch(
            filterActions.updateChannelFilterByIssueId({
                value: {
                    interpreter: 'javascript',
                    issueId: 'quick-capacity',
                    function: (channel: LndChannel) => channel.capacity > Math.pow(10, event.value),
                    source: `return (channel) =>
    channel.capacity > ${Math.pow(10, event.value)}                            
`,
                } as Filter,
            }),
        );
    }
}
