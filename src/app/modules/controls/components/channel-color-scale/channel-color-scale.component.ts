import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { channelColorMap } from 'src/app/modules/controls-channel/selectors';
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

    public currentColorMapHex: string[];
    public backgrounColor: string;
    public divisions: number[];

    public slices: number = 10;

    ngOnInit(): void {
        this.currentChannelMapColor$.subscribe((mapName) => {
            this.currentColorMapHex = colormap({
                colormap: mapName,
                nshades: this.slices,
                format: 'hex',
                alpha: 1,
            });
            this.backgrounColor =
                'background-image: linear-gradient( ' +
                this.currentColorMapHex.reverse().join(', ') +
                ');';
        });

        this.maxCapacity$.subscribe((max) => {
            this.divisions = [];
            for (let i = 0; i < this.slices - 1; i++) {
                this.divisions.push(Math.floor(max / (i + 1)));
            }
            this.divisions.push(0);
        });
    }
}
