import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { InstancedInterleavedBuffer, InterleavedBufferAttribute } from 'three';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry';
import { shouldRenderEdges } from 'src/app/modules/controls-channel/selectors';
import { GraphState } from 'src/app/renderer/graph-renderer/reducer';
import { ChannelBuffersService } from 'src/app/renderer/graph-renderer/services/channel-buffers/channel-buffers.service';

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
        if (this.channelBufferService.vertex.data.length > 0)
            this.setPositions(this.channelBufferService.vertex.data);

        const a = this.channelBufferService.color.data;
        const b = new Float32Array(a).map((x) => x / 256);
        if (this.channelBufferService.color.data.length > 0) this.setColors(b);

        if (this.channelBufferService.thickness.data.length > 0) {
            const c = new InstancedInterleavedBuffer(
                this.channelBufferService.thickness.data,
                2,
                1,
            );
            this.setAttribute('channelWidthProperty', new InterleavedBufferAttribute(c, 1, 0));
        }

        this.updateGeometry();
    }

    public updateAttributes() {
        if (this.attributes['channelWidthProperty'])
            this.attributes['channelWidthProperty'].needsUpdate = true;

        if (this.attributes['instanceColorEnd'])
            this.attributes['instanceColorEnd'].needsUpdate = true;
        if (this.attributes['instanceColorStart'])
            this.attributes['instanceColorStart'].needsUpdate = true;
        if (this.attributes['instanceEnd']) this.attributes['instanceEnd'].needsUpdate = true;
        if (this.attributes['instanceStart']) this.attributes['instanceStart'].needsUpdate = true;
    }

    public updateGeometry() {
        this.updateAttributes();
        this.computeBoundingBox();
        this.computeBoundingSphere();
    }

    private handleUpdates() {
        let currentShouldRender;

        this.channelBufferService.color.onUpdate.subscribe((drawRange) => {
            this.setDrawRange(0, currentShouldRender ? Infinity : 0);
            this.instanceCount = drawRange / 2;
            this.initializeGeometry();
        });

        this.channelBufferService.thickness.onUpdate.subscribe(() => {
            this.setDrawRange(0, currentShouldRender ? Infinity : 0);
            this.updateAttributes();
        });

        this.store$.select(shouldRenderEdges).subscribe((shouldRender) => {
            currentShouldRender = shouldRender;
            this.setDrawRange(0, currentShouldRender ? Infinity : 0);
        });
    }
}
