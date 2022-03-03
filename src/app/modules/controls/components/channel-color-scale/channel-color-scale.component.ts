import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import {
    channelColorMap,
    selectUseLogColorScale,
} from 'src/app/modules/controls-channel/selectors';
import {
    selectMaximumChannelCapacity,
    selectMinimumChannelCapacity,
} from 'src/app/modules/graph-renderer/selectors';
import { ControlsState } from '../../types';
const colormap = require('colormap');

@Component({
    selector: 'app-channel-color-scale',
    templateUrl: './channel-color-scale.component.html',
    styleUrls: ['./channel-color-scale.component.scss'],
})
export class ChannelColorScaleComponent implements OnInit {
    constructor(private store$: Store<ControlsState>) {}

    public currentChannelMapColor$ = this.store$.select(channelColorMap);
    public minCapacity$ = this.store$
        .select(selectMinimumChannelCapacity)
        .pipe(map((c) => (c === Infinity ? 0 : c)));
    public maxCapacity$ = this.store$.select(selectMaximumChannelCapacity);
    public isLogScale$ = this.store$.select(selectUseLogColorScale);

    public currentColorMapHex: string[];
    public backgrounColor: string;
    public divisions: number[];

    public slices: number = 10;
    public shades: number = 20;

    ngOnInit(): void {
        this.currentChannelMapColor$.subscribe((mapName) => {
            this.currentColorMapHex = colormap({
                colormap: mapName,
                nshades: this.shades,
                format: 'hex',
                alpha: 1,
            });
            this.backgrounColor =
                'background-image: linear-gradient( ' +
                this.currentColorMapHex.reverse().join(', ') +
                ');';
        });

        combineLatest(this.minCapacity$, this.maxCapacity$, this.isLogScale$).subscribe(
            ([min, max, isLogScale]) => {
                this.divisions = [];
                for (let i = 0; i < this.slices + 1; i++) {
                    let computed;
                    if (isLogScale) {
                        const maxLogScale = Math.log10(max);
                        const maxMinLogScale = Math.log10(max - min);
                        const difference = maxMinLogScale / 10;
                        const log = maxLogScale - i * difference;
                        computed = Math.round(Math.pow(10, log)) || 0;
                    } else {
                        const difference = (max - min) / 10;
                        computed = max - i * difference;
                    }

                    this.divisions.push(computed);
                }
            },
        );
    }
}
