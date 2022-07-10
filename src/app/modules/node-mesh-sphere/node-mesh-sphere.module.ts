import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NodeGeometry } from './geometry';
import { TestMaterial } from './material/test-material.service';
import { NodesSphereObjectComponent } from './object';
import { NodePositionOffsetService, NodeSizeOffsetService } from './services';
import { NodeTextures } from './textures';

@NgModule({
    declarations: [NodesSphereObjectComponent],
    imports: [CommonModule],
    exports: [NodesSphereObjectComponent],
    providers: [
        NodeGeometry,
        NodeTextures,
        TestMaterial,
        NodePositionOffsetService,
        NodeSizeOffsetService,
    ],
})
export class NodeMeshSphereModule {}
