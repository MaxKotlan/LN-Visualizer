import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NodeGeometry } from './geometry';
import { NodesObjectComponent } from './object';
import { NodeTextures } from './textures';

@NgModule({
    declarations: [NodesObjectComponent],
    imports: [CommonModule],
    exports: [NodesObjectComponent],
    providers: [NodeGeometry, NodeTextures],
})
export class NodeMeshModule {}
