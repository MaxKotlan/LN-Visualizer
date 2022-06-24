import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    ChannelMinMaxFilter,
    ConnectedChannelsFilter,
    PolicyMinMaxFilter,
} from './channel-filters';
import { NodeMinMaxFilter } from './node-filters';

@NgModule({
    providers: [ConnectedChannelsFilter, PolicyMinMaxFilter, ChannelMinMaxFilter, NodeMinMaxFilter],
    imports: [CommonModule],
})
export class FilterTemplatesModule {}
