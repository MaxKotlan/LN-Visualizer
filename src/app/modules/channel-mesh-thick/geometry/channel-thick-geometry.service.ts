import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as THREE from 'three';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { shouldRenderEdges } from '../../controls-channel/selectors';
import { GraphState } from '../../graph-renderer/reducer';
import { ChannelBuffersService } from '../../graph-renderer/services/channel-buffers/channel-buffers.service';

@Injectable({
    providedIn: 'root',
})
export class ChannelThickGeometry extends LineGeometry {
    constructor(
        private channelBufferService: ChannelBuffersService,
        private store$: Store<GraphState>,
    ) {
        super();
        this.initializeGeometry();
        //this.handleUpdates();
    }

    public initializeGeometry() {
        // this.setAttribute(
        //     'color',
        //     new THREE.BufferAttribute(this.channelBufferService.color.data, 3, true),
        // );
        this.setPositions([0, 0, 1, 0, 2, 0]);
        // this.setAttribute(
        //     'position',
        //     new THREE.BufferAttribute(this.channelBufferService.vertex.data, 3),
        // );
        this.updateGeometry();
    }

    public updateGeometry() {
        // this.attributes['color'].needsUpdate = true;
        // this.attributes['position'].needsUpdate = true;
        this.computeBoundingBox();
        this.computeBoundingSphere();
    }

    private handleUpdates() {
        let currentDrawRange;
        let currentShouldRender;

        this.channelBufferService.color.onUpdate.subscribe((drawRange) => {
            currentDrawRange = drawRange;
            this.initializeGeometry();
            this.setDrawRange(0, currentShouldRender ? drawRange : 0);
        });

        this.store$.select(shouldRenderEdges).subscribe((shouldRender) => {
            currentShouldRender = shouldRender;
            this.setDrawRange(0, currentShouldRender ? currentDrawRange : 0);
        });
    }
}
