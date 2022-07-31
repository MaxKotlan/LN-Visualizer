import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { ChannelControlState } from 'src/app/ui/settings/controls-channel/reducers';
import {
    channelColor,
    channelColorMapRgb,
    selectUseLogColorScale,
} from 'src/app/ui/settings/controls-channel/selectors';
import { LndChannel } from 'src/app/types/channels.interface';
import { MinMaxTotal } from 'src/app/types/min-max-total.interface';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import {
    selectChannelFeesMinMaxTotal,
    selectChannelMinMaxTotal,
} from 'src/app/graph-data/graph-statistics/selectors/graph-statistics.selectors';
import { CapacityColorServiceService } from '../capacity-color/capacity-color-service.service';

@UntilDestroy()
@Injectable({
    providedIn: 'root',
})
export class ChannelColorService {
    constructor(
        private store$: Store<ChannelControlState>,
        private capacityColorServiceService: CapacityColorServiceService,
    ) {
        this.store$
            .select(channelColor)
            .pipe(untilDestroyed(this))
            .subscribe((channelColor) => (this.channelColorCache = channelColor));

        this.store$
            .select(selectChannelMinMaxTotal)
            .pipe(untilDestroyed(this))
            .subscribe((minMax) => (this.minMaxCap = minMax));

        this.store$
            .select(selectChannelFeesMinMaxTotal)
            .pipe(untilDestroyed(this))
            .subscribe((minMax) => {
                this.minMaxFee = minMax;
            });

        this.store$
            .select(channelColorMapRgb)
            .pipe(untilDestroyed(this))
            .subscribe((arr) => (this.colorArray = arr));

        this.store$
            .select(selectUseLogColorScale)
            .pipe(untilDestroyed(this))
            .subscribe((ulcs) => (this.useLogColorScale = ulcs));
    }

    private colorArray: number[][];
    private minMaxFee: MinMaxTotal;
    private minMaxCap: MinMaxTotal;
    private channelColorCache: string;
    private useLogColorScale: boolean;

    public map(node1: LndNodeWithPosition, node2: LndNodeWithPosition, channel: LndChannel) {
        return this.algorithmSelector(node1, node2, channel);
    }

    private algorithmSelector(
        node1: LndNodeWithPosition,
        node2: LndNodeWithPosition,
        channel: LndChannel,
    ) {
        if (this.channelColorCache === 'channel-capacity') {
            return this.capacityColorServiceService.getColorMap(
                this.useLogColorScale,
                channel.capacity,
            );
        }
        if (this.channelColorCache === 'channel-fees') {
            let normalizedValueA;
            let normalizedValueB;

            if (this.useLogColorScale) {
                normalizedValueA =
                    Math.log10(
                        channel.policies[0].fee_rate -
                            //Number.parseInt(channel.policies[0].base_fee_mtokens) -
                            this.minMaxFee.min,
                    ) / Math.log10(this.minMaxFee.max - this.minMaxFee.min);
                normalizedValueB =
                    Math.log10(
                        channel.policies[1].fee_rate -
                            //Number.parseInt(channel.policies[0].base_fee_mtokens) -
                            this.minMaxFee.min,
                    ) / Math.log10(this.minMaxFee.max - this.minMaxFee.min);
            } else {
                normalizedValueA =
                    (channel.policies[0].fee_rate - this.minMaxFee.min) /
                    (this.minMaxFee.max - this.minMaxFee.min);
                normalizedValueB =
                    (channel.policies[1].fee_rate - this.minMaxFee.min) /
                    (this.minMaxFee.max - this.minMaxFee.min);
            }
            //const normalizedCap = Math.sqrt(channel.capacity / this.maximumChannelCapacity);
            const toColorIndexA = Math.round(normalizedValueA * 499) || undefined;
            const toColorIndexB = Math.round(normalizedValueB * 499) || undefined;

            const noDataAvailableColor = [255, 0, 0];

            try {
                const colorArrA =
                    toColorIndexA >= 0 && toColorIndexA < 500
                        ? this.colorArray[toColorIndexA]
                        : noDataAvailableColor;
                const colorArrB =
                    toColorIndexB >= 0 && toColorIndexB < 500
                        ? this.colorArray[toColorIndexB]
                        : noDataAvailableColor;

                const result = [...colorArrA, ...colorArrB];
                return result;
            } catch (e) {
                console.log(toColorIndexA, e);
                return [255, 255, 255, 255, 255, 255];
            }
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
