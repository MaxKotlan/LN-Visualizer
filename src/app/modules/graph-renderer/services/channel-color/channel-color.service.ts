import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { ChannelControlState } from 'src/app/modules/controls-channel/reducers';
import { channelColor } from 'src/app/modules/controls-channel/selectors';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';

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
    }

    private channelColorCache: string;

    public map(node1: LndNodeWithPosition, node2: LndNodeWithPosition) {
        return this.algorithmSelector(node1, node2);
    }

    private algorithmSelector(node1: LndNodeWithPosition, node2: LndNodeWithPosition) {
        if (this.channelColorCache === 'channel-capacity') {
            return [...this.fromHexString(node1.color), ...this.fromHexString(node2.color)];
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
