import { Component, Input, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import { shouldRenderEdges } from 'src/app/modules/controls-channel/selectors';
import * as THREE from 'three';
import { GraphState } from '../../reducer';
import { ChannelBuffersService } from '../../services/channel-buffers/channel-buffers.service';

@UntilDestroy()
@Component({
    selector: 'app-graph-edge-mesh',
    providers: [provideParent(SphereMeshComponent)],
    template: '<ng-content></ng-content>',
})
export class GraphEdgeMeshComponent extends AbstractObject3D<THREE.LineSegments> {
    @Input() shouldRender: boolean = false;
    @Input() dashedLines: boolean = true;
    @Input() depthTest: boolean = false;

    private geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    private material: THREE.LineDashedMaterial | THREE.LineBasicMaterial;

    constructor(
        protected override rendererService: RendererService,
        private channelBufferService: ChannelBuffersService,
        private store$: Store<GraphState>,
        @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
    ) {
        super(rendererService, parent);
    }

    protected updateGeometry() {
        this.geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(this.channelBufferService.color.data, 3, true),
        );
        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(this.channelBufferService.vertex.data, 3),
        );
        this.geometry.attributes['color'].needsUpdate = true;
        this.geometry.attributes['position'].needsUpdate = true;
        this.geometry.computeBoundingBox();
        this.geometry.computeBoundingSphere();
    }

    protected generateMaterial() {
        const material = this.dashedLines
            ? new THREE.LineDashedMaterial({
                  color: 0xffffff,
                  linewidth: 1,
                  vertexColors: true,
                  scale: 1,
                  dashSize: 1,
                  gapSize: 3,
              })
            : new THREE.LineBasicMaterial({
                  color: 0xffffff,
                  linewidth: 1,
                  vertexColors: true,
              });

        material.depthTest = this.depthTest;
        this.material = material;
    }

    protected newObject3DInstance(): THREE.LineSegments {
        this.updateGeometry();
        this.generateMaterial();
        const mesh = new THREE.LineSegments(this.geometry, this.material);
        mesh.renderOrder = -1;
        this.handleUpdates();
        return mesh;
    }

    private handleUpdates() {
        let currentDrawRange = 0;
        let currentShouldRender;
        //Update position and color buffers on color buffer update
        this.channelBufferService.color.onUpdate.subscribe((drawRange) => {
            currentDrawRange = drawRange;
            this.updateGeometry();
            this.geometry.setDrawRange(0, currentShouldRender ? drawRange : 0);
            this.rendererService.render();
        });

        this.store$.select(shouldRenderEdges).subscribe((shouldRender) => {
            currentShouldRender = shouldRender;
            this.geometry.setDrawRange(0, currentShouldRender ? currentDrawRange : 0);
            this.rendererService.render();
        });
    }
}
