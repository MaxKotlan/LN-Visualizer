import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    ChannelMinMaxFilter,
    ConnectedChannelsFilter,
    GenericChannelFilter,
    PolicyMinMaxFilter,
} from './channel-filters';
import { GenericNodeFilter, NodeFeatureFilter, NodeMinMaxFilter } from './node-filters';
import { NodeNetworkFilter } from './node-filters/network-filter';

@NgModule({
    providers: [
        ConnectedChannelsFilter,
        PolicyMinMaxFilter,
        ChannelMinMaxFilter,
        NodeMinMaxFilter,
        GenericChannelFilter,
        GenericNodeFilter,
        NodeNetworkFilter,
        NodeFeatureFilter,
    ],
    imports: [CommonModule],
})
export class FilterTemplatesModule {}
