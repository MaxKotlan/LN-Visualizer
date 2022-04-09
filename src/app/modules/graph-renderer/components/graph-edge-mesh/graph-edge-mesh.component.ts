import { Component, Input, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import { BufferRef } from 'src/app/types/bufferRef.interface';
import * as THREE from 'three';
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
        @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
    ) {
        super(rendererService, parent);
    }

    override ngOnChanges(simpleChanges: SimpleChanges) {
        const obj: THREE.LineSegments = this.getObject();
        if (obj) {
            // const a = this.generateGeometry();
            // if (a) {
            this.generateGeometry();
            (obj as any)['geometry'] = this.geometry;
            (obj as any)['material'] = this.generateMaterial();
            obj.geometry.computeBoundingBox();
            obj.computeLineDistances();
            //}
        }
        this.rendererService.render();
        super.ngOnChanges(simpleChanges);
    }

    protected generateGeometry() {
        this.geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(this.channelBufferService.color.data, 3, true),
        );
        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(this.channelBufferService.vertex.data, 3),
        );
        // this.geometry.setDrawRange(0, this.shouldRender ? this.channelBufferService.color.size : 0);
        // this.geometry.attributes['color'].needsUpdate = true;
        // this.geometry.attributes['position'].needsUpdate = true;

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
        this.generateGeometry();
        this.generateMaterial();
        const mesh = new THREE.LineSegments(this.geometry, this.material);
        mesh.renderOrder = -1;

        console.log('booom shakalaka');

        this.channelBufferService.vertex.onUpdate.subscribe((drawRange) => {
            this.geometry.attributes['position'].needsUpdate = true;
            this.geometry.setDrawRange(0, drawRange);
            this.geometry.computeBoundingBox();
            this.geometry.computeBoundingSphere();
            this.object.computeLineDistances();
            (this.object as any)['geometry'] = this.geometry;
            (this.object as any)['material'] = this.material;
            this.rendererService.render();
        });
        this.channelBufferService.color.onUpdate.subscribe((drawRange) => {
            this.geometry.attributes['color'].needsUpdate = true;
            (this.object as any)['geometry'] = this.geometry;
            (this.object as any)['material'] = this.material;
            this.geometry.setDrawRange(0, drawRange);
            this.geometry.computeBoundingBox();
            this.geometry.computeBoundingSphere();
            this.object.computeLineDistances();
            this.rendererService.render();
        });

        return mesh;
    }
}
