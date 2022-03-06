import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { ChannelControlState } from 'src/app/modules/controls-channel/reducers';
import {
    channelColorMap,
    selectUseLogColorScale,
} from 'src/app/modules/controls-channel/selectors';
import {
    selectMaximumChannelCapacity,
    selectMinimumChannelCapacity,
} from 'src/app/modules/graph-renderer/selectors';

@Component({
    selector: 'app-channel-color-scale',
    templateUrl: './channel-color-scale.component.html',
    styleUrls: ['./channel-color-scale.component.scss'],
})
export class ChannelColorScaleComponent {
    constructor(private store$: Store<ChannelControlState>) {}

    public currentChannelMapColor$ = this.store$.select(channelColorMap);
    public minCapacity$ = this.store$
        .select(selectMinimumChannelCapacity)
        .pipe(map((c) => (c === Infinity ? 0 : c)));
    public maxCapacity$ = this.store$.select(selectMaximumChannelCapacity);
    public isLogScale$ = this.store$.select(selectUseLogColorScale);
}
