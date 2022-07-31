import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import { selectMinMaxFiltered } from 'src/app/graph-data/graph-statistics/selectors';
import { ChannelControlState } from 'src/app/ui/settings/controls-channel/reducers';
import {
    channelColorMap,
    channelColorToStat,
    selectUseLogColorScale,
} from 'src/app/ui/settings/controls-channel/selectors';

@Component({
    selector: 'app-channel-color-scale',
    templateUrl: './channel-color-scale.component.html',
    styleUrls: ['./channel-color-scale.component.scss'],
})
export class ChannelColorScaleComponent {
    constructor(private store$: Store<ChannelControlState>) {
        this.minMax$.subscribe((x) => console.log(x));
    }

    public label$ = this.store$.select(channelColorToStat);
    public currentChannelMapColor$ = this.store$.select(channelColorMap);
    public minMax$ = this.label$.pipe(
        switchMap((propName) => this.store$.select(selectMinMaxFiltered(propName))),
    );
    public minCapacity$ = this.minMax$.pipe(map((x) => x.min));
    public maxCapacity$ = this.minMax$.pipe(map((x) => x.max));
    public isLogScale$ = this.store$.select(selectUseLogColorScale);
}
