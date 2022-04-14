import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelGeometry } from './geometry';
import { ChannelObjectComponent } from './object';
import { ChannelMaterial } from './material';

@NgModule({
    declarations: [ChannelObjectComponent],
    imports: [CommonModule],
    providers: [ChannelGeometry, ChannelMaterial],
    exports: [ChannelObjectComponent],
})
export class ChannelMeshModule {}
