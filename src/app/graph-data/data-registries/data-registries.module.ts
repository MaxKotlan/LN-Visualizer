import { NgModule } from '@angular/core';
import {
    ChannelRegistryService,
    FilteredChannelRegistryService,
    FilteredNodeRegistryService,
    NodeRegistryService,
    PointTreeService,
} from './services';

@NgModule({
    providers: [
        ChannelRegistryService,
        FilteredChannelRegistryService,
        FilteredNodeRegistryService,
        NodeRegistryService,
        PointTreeService,
    ],
})
export class DataRegistryModule {}
