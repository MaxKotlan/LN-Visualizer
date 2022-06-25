import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    ChannelMinMaxFilter,
    ConnectedChannelsFilter,
    GenericChannelFilter,
    PolicyMinMaxFilter,
} from './channel-filters';
import { GenericNodeFilter, NodeMinMaxFilter } from './node-filters';

@NgModule({
    providers: [
        ConnectedChannelsFilter,
        PolicyMinMaxFilter,
        ChannelMinMaxFilter,
        NodeMinMaxFilter,
        GenericChannelFilter,
        GenericNodeFilter,
    ],
    imports: [CommonModule],
})
export class FilterTemplatesModule {}
