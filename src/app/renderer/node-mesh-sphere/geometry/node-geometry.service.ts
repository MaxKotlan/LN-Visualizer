import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as THREE from 'three';
import { shouldRenderNodes } from 'src/app/ui/controls-node/selectors/node-controls.selectors';
import { GraphState } from 'src/app/renderer/graph-renderer/reducer';
import { NodeBuffersService } from 'src/app/renderer/graph-renderer/services/node-buffers/node-buffers.service';

@Injectable({
    providedIn: 'root',
})
export class NodeGeometry extends THREE.BufferGeometry {
    constructor(private nodeBuffersService: NodeBuffersService, private store$: Store<GraphState>) {
        super();
        this.initializeGeometry();
        this.handleUpdates();
    }

    public initializeGeometry() {
        this.setAttribute(
            'nodeColor',
            new THREE.BufferAttribute(this.nodeBuffersService.color.data, 3, true),
        );
        this.setAttribute(
            'position',
            new THREE.BufferAttribute(this.nodeBuffersService.vertex.data, 3),
        );
        this.setAttribute(
            'averageCapacityRatio',
            new THREE.BufferAttribute(this.nodeBuffersService.capacity.data, 1, false),
        );
        this.updateGeometry();
    }

    public updateGeometry() {
        this.attributes['position'].needsUpdate = true;
        this.attributes['nodeColor'].needsUpdate = true;
        this.attributes['averageCapacityRatio'].needsUpdate = true;
        this.computeBoundingBox();
        this.computeBoundingSphere();
    }

    public handleUpdates() {
        let currentDrawRange;
        let currentShouldRender = true;

        this.nodeBuffersService.vertex.onUpdate.subscribe((drawRange) => {
            currentDrawRange = drawRange;
            this.initializeGeometry();
            this.setDrawRange(0, currentShouldRender ? drawRange : 0);
        });

        this.store$.select(shouldRenderNodes).subscribe((shouldRender) => {
            currentShouldRender = shouldRender;
            this.setDrawRange(0, currentShouldRender ? currentDrawRange : 0);
        });

        this.nodeBuffersService.color.onUpdate.subscribe(() => {
            this.attributes['nodeColor'].needsUpdate = true;
        });

        this.nodeBuffersService.capacity.onUpdate.subscribe(() => {
            this.attributes['averageCapacityRatio'].needsUpdate = true;
        });
    }
}
