import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as THREE from 'three';
import { shouldRenderEdges } from 'src/app/ui/settings/controls-channel/selectors';
import { GraphState } from 'src/app/renderer/graph-renderer/reducer';
import { ChannelBuffersService } from 'src/app/renderer/graph-renderer/services/channel-buffers/channel-buffers.service';

@Injectable({
    providedIn: 'root',
})
export class ChannelGeometry extends THREE.BufferGeometry {
    constructor(
        private channelBufferService: ChannelBuffersService,
        private store$: Store<GraphState>,
    ) {
        super();
        this.initializeGeometry();
        this.handleUpdates();
    }

    public initializeGeometry() {
        this.setAttribute(
            'color',
            new THREE.BufferAttribute(this.channelBufferService.color.data, 3, true),
        );
        this.setAttribute(
            'position',
            new THREE.BufferAttribute(this.channelBufferService.vertex.data, 3),
        );
        this.updateGeometry();
    }

    public updateGeometry() {
        this.attributes['color'].needsUpdate = true;
        this.attributes['position'].needsUpdate = true;
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
