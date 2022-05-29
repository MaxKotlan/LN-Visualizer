import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as THREE from 'three';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry';
import { shouldRenderEdges } from '../../controls-channel/selectors';
import { GraphState } from '../../graph-renderer/reducer';
import { ChannelBuffersService } from '../../graph-renderer/services/channel-buffers/channel-buffers.service';

@Injectable({
    providedIn: 'root',
})
export class ChannelThickGeometry extends LineSegmentsGeometry {
    constructor(
        private channelBufferService: ChannelBuffersService,
        private store$: Store<GraphState>,
    ) {
        super();
        this.initializeGeometry();
        this.handleUpdates();
    }

    public initializeGeometry() {
        // this.setAttribute(
        //     'color',
        //     new THREE.BufferAttribute(this.channelBufferService.color.data, 3, true),
        // );
        if (this.channelBufferService.vertex.data.length > 0)
            this.setPositions(this.channelBufferService.vertex.data);

        const a = this.channelBufferService.color.data;
        const b = new Float32Array(a).map((x) => x / 256);
        if (this.channelBufferService.color.data.length > 0) this.setColors(b);

        this.updateGeometry();
    }

    public updateAttributes() {
        if (this.attributes['instanceColorEnd'])
            this.attributes['instanceColorEnd'].needsUpdate = true;
        if (this.attributes['instanceColorStart'])
            this.attributes['instanceColorStart'].needsUpdate = true;
        if (this.attributes['instanceEnd']) this.attributes['instanceEnd'].needsUpdate = true;
        if (this.attributes['instanceStart']) this.attributes['instanceStart'].needsUpdate = true;
    }

    public updateGeometry() {
        console.log(this);
        this.updateAttributes();
        this.computeBoundingBox();
        this.computeBoundingSphere();
    }

    private handleUpdates() {
        let currentDrawRange;
        let currentShouldRender;

        this.channelBufferService.color.onUpdate.subscribe((drawRange) => {
            currentDrawRange = drawRange;
            this.initializeGeometry();
            //this.setDrawRange(0, currentShouldRender ? drawRange : 0);
        });

        this.store$.select(shouldRenderEdges).subscribe((shouldRender) => {
            currentShouldRender = shouldRender;
            //this.setDrawRange(0, currentShouldRender ? currentDrawRange : 0);
        });
    }
}
