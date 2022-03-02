import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import {
    channelColorMap,
    selectUseLogColorScale,
} from 'src/app/modules/controls-channel/selectors';
import { selectMaximumChannelCapacity } from 'src/app/modules/graph-renderer/selectors';
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

        combineLatest(this.maxCapacity$, this.isLogScale$).subscribe(([max, isLogScale]) => {
            this.divisions = [];
            for (let i = 0; i < this.slices; i++) {
                let computed;
                if (isLogScale) {
                    const difference = max / 10;
                    computed = max * Math.floor(Math.log10(i * difference));
                } else {
                    const difference = max / 10;
                    computed = max - i * difference;
                }

                this.divisions.push(computed);
            }
            this.divisions.push(0);
        });
    }
}
