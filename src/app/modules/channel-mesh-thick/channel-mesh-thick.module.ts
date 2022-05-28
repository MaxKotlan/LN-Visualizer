import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelThickGeometry } from '../channel-mesh/geometry';
import { ChannelThickObjectComponent } from './object';
import { ChannelThickMaterial } from './material';

@NgModule({
    declarations: [ChannelThickObjectComponent],
    imports: [CommonModule],
    providers: [ChannelThickGeometry, ChannelThickMaterial],
    exports: [ChannelThickObjectComponent],
})
export class ChannelMeshModule {}
