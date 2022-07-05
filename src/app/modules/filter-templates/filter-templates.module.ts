import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    ChannelMinMaxFilter,
    ConnectedChannelsFilter,
    GenericChannelFilter,
    PolicyMinMaxFilter,
} from './channel-filters';
import { GenericNodeFilter, NodeMinMaxFilter } from './node-filters';
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
    ],
    imports: [CommonModule],
})
export class FilterTemplatesModule {}
