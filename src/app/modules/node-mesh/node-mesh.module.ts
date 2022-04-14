import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NodeGeometry } from './geometry/node-geometry.service';
import { NodesObjectComponent } from './object';
import { NodeTextures } from './textures/lightning-node-texture.service';

@NgModule({
    declarations: [NodesObjectComponent],
    imports: [CommonModule],
    exports: [NodesObjectComponent],
    providers: [NodeGeometry, NodeTextures],
})
export class NodeMeshModule {}
