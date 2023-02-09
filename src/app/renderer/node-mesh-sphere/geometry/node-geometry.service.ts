import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GraphState } from 'src/app/renderer/graph-renderer/reducer';
import { NodeBuffersService } from 'src/app/renderer/graph-renderer/services/node-buffers/node-buffers.service';
import * as THREE from 'three';
import { InstancedMesh } from 'three';
import { NodeTextures } from '../../node-mesh/textures';

@Injectable({
    providedIn: 'root',
})
export class NodeGeometry {
    constructor(
        private nodeBuffersService: NodeBuffersService,
        private store$: Store<GraphState>,
        private nodeTexture: NodeTextures,
    ) {
        this.initializeMeshInstance();
        // this.initializeGeometry();
        this.handleUpdates();
    }

    public mesh: InstancedMesh;

    public initializeMeshInstance() {
        const geometry = new THREE.IcosahedronGeometry(0.5, 3);
        const material = new THREE.MeshPhongMaterial({
            map: this.nodeTexture.getTexture('lightningIconSphere'),
            color: 0xffffff,
            specular: 0.1,
        } as THREE.MeshPhongMaterialParameters);
        this.mesh = new THREE.InstancedMesh(
            geometry,
            material,
            this.nodeBuffersService.vertex.data.length / 3,
        );

        const matrix = new THREE.Matrix4();
        const color = new THREE.Color();

        for (let i = 0; i < this.nodeBuffersService.vertex.data.length / 3; i += 3) {
            matrix.setPosition(
                this.nodeBuffersService.vertex.data[i],
                this.nodeBuffersService.vertex.data[i + 1],
                this.nodeBuffersService.vertex.data[i + 2],
            );
            color.setRGB(
                this.nodeBuffersService.color.data[i],
                this.nodeBuffersService.color.data[i + 1],
                this.nodeBuffersService.color.data[i + 2],
            );
            this.mesh.setMatrixAt(i, matrix);
            this.mesh.setColorAt(i, color);
        }
    }

    // public initializeGeometry() {
    //     this.setAttribute(
    //         'nodeColor',
    //         new THREE.BufferAttribute(this.nodeBuffersService.color.data, 3, true),
    //     );
    //     this.setAttribute(
    //         'position',
    //         new THREE.BufferAttribute(this.nodeBuffersService.vertex.data, 3),
    //     );
    //     this.setAttribute(
    //         'averageCapacityRatio',
    //         new THREE.BufferAttribute(this.nodeBuffersService.capacity.data, 1, false),
    //     );
    //     this.updateGeometry();
    // }

    // public updateGeometry() {
    //     this.attributes['position'].needsUpdate = true;
    //     this.attributes['nodeColor'].needsUpdate = true;
    //     this.attributes['averageCapacityRatio'].needsUpdate = true;
    //     this.computeBoundingBox();
    //     this.computeBoundingSphere();
    // }

    public handleUpdates() {
        let currentDrawRange;
        // let currentShouldRender = true;

        this.nodeBuffersService.vertex.onUpdate.subscribe((drawRange) => {
            currentDrawRange = drawRange;
            this.initializeMeshInstance();
            console.log(this.mesh);
            // this.setDrawRange(0, currentShouldRender ? drawRange : 0);
        });

        // this.store$.select(shouldRenderNodes).subscribe((shouldRender) => {
        //     currentShouldRender = shouldRender;
        //     this.setDrawRange(0, currentShouldRender ? currentDrawRange : 0);
        // });

        // this.nodeBuffersService.color.onUpdate.subscribe(() => {
        //     this.attributes['nodeColor'].needsUpdate = true;
        // });

        // this.nodeBuffersService.capacity.onUpdate.subscribe(() => {
        //     this.attributes['averageCapacityRatio'].needsUpdate = true;
        // });
    }
}
