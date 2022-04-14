import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelGeometry } from './geometry';
import { ChannelObjectComponent } from './object';

@NgModule({
    declarations: [ChannelObjectComponent],
    imports: [CommonModule],
    providers: [ChannelGeometry],
    exports: [ChannelObjectComponent],
})
export class ChannelMeshModule {}
