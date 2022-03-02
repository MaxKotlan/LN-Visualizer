import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { ChannelControlState } from 'src/app/modules/controls-channel/reducers';
import { channelColor } from 'src/app/modules/controls-channel/selectors';
import { LndChannel } from 'src/app/types/channels.interface';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import { selectAverageCapacity, selectMaximumChannelCapacity } from '../../selectors';

let colormap = require('colormap');

@UntilDestroy()
@Injectable({
    providedIn: 'root',
})
export class ChannelColorService {
    constructor(private store$: Store<ChannelControlState>) {
        this.store$
            .select(channelColor)
            .pipe(untilDestroyed(this))
            .subscribe((channelColor) => (this.channelColorCache = channelColor));

        this.store$
            .select(selectAverageCapacity)
            .pipe(untilDestroyed(this))
            .subscribe((averageCap) => (this.networkAverageCapacity = averageCap));

        this.store$
            .select(selectMaximumChannelCapacity)
            .pipe(untilDestroyed(this))
            .subscribe((maximumCap) => (this.maximumChannelCapacity = maximumCap));

        let colors = colormap({
            colormap: 'viridis',
            nshades: 100,
            format: 'hex',
            alpha: 1,
        });
        console.log(colors);

        this.colorArray = colors.map((s) => this.fromHexString(s));
        console.log(this.colorArray);
    }

    private colors: string[];
    private colorArray: number[][];

    private maximumChannelCapacity: number;
    private networkAverageCapacity: number;
    private channelColorCache: string;

    public map(node1: LndNodeWithPosition, node2: LndNodeWithPosition, channel: LndChannel) {
        return this.algorithmSelector(node1, node2, channel);
    }

    private algorithmSelector(
        node1: LndNodeWithPosition,
        node2: LndNodeWithPosition,
        channel: LndChannel,
    ) {
        if (this.channelColorCache === 'channel-capacity') {
            const linearCap = channel.capacity / this.maximumChannelCapacity;
            const logCap =
                Math.log10(channel.capacity + 1) / Math.log10(this.maximumChannelCapacity + 1);
            //const normalizedCap = Math.sqrt(channel.capacity / this.maximumChannelCapacity);
            const toColorIndex = Math.round(logCap * 99);
            // console.log(toColorIndex);

            // if (normalizedCap < 2) console.log(normalizedCap);
            // console.log(toColorIndex);
            // console.log(toColorIndex);

            return [...this.colorArray[toColorIndex], ...this.colorArray[toColorIndex]];

            //return [255 - toByte, toByte, 0, 255 - toByte, toByte, 0];
        }
        if (this.channelColorCache === 'interpolate-node-color') {
            return [...this.fromHexString(node1.color), ...this.fromHexString(node2.color)];
        }
        if (this.channelColorCache === 'interpolate-node-average-capacity') {
            return [255, 0, 0, 0, 255, 0];
        }
        if (this.channelColorCache === 'interpolate-node-total-capacity') {
            return [255, 0, 0, 0, 255, 0];
        }

        return [255, 255, 0, 255, 255, 0];
    }

    private fromHexString = (hexString: string) => [
        parseInt(hexString[1] + hexString[2], 16),
        parseInt(hexString[3] + hexString[4], 16),
        parseInt(hexString[5] + hexString[6], 16),
    ];
}
