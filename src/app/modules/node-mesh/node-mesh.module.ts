import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NodeGeometry } from './geometry';
import { TestMaterial } from './material/test-material.service';
import { NodesObjectComponent } from './object';
import { NodePositionOffsetService } from './services/node-position-offset.service';
import { NodeTextures } from './textures';

@NgModule({
    declarations: [NodesObjectComponent],
    imports: [CommonModule],
    exports: [NodesObjectComponent],
    providers: [NodeGeometry, NodeTextures, TestMaterial, NodePositionOffsetService],
})
export class NodeMeshModule {}
