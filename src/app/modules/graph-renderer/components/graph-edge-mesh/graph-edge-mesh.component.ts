import { Component, Input, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import { BufferRef } from 'src/app/types/bufferRef.interface';
import * as THREE from 'three';
import { ChannelShader } from '../../shaders/channel';

@UntilDestroy()
@Component({
    selector: 'app-graph-edge-mesh',
    providers: [provideParent(SphereMeshComponent)],
    template: '<ng-content></ng-content>',
})
export class GraphEdgeMeshComponent extends AbstractObject3D<THREE.LineSegments> {
    @Input() edgeVertices!: [BufferRef<Uint8Array>, BufferRef<Float32Array>];
    @Input() shouldRender: boolean = false;
    @Input() dashedLines: boolean = true;
    @Input() depthTest: boolean = false;

    private geometry: THREE.BufferGeometry = new THREE.BufferGeometry();

    constructor(
        protected override rendererService: RendererService,
        @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
    ) {
        super(rendererService, parent);
    }

    override ngOnChanges(simpleChanges: SimpleChanges) {
        const obj: THREE.LineSegments = this.getObject();
        if (obj) {
            const a = this.generateGeometry();
            if (a) {
                (obj as any)['geometry'] = this.geometry;
                (obj as any)['material'] = this.generateMaterial();
                obj.geometry.computeBoundingBox();
                obj.computeLineDistances();
            }
        }
        this.rendererService.render();
        super.ngOnChanges(simpleChanges);
    }

    protected generateGeometry() {
        if (!this.edgeVertices) return;
        if (!this.edgeVertices[1]) return;
        if (!this.edgeVertices[0]) return;
        this.geometry.setAttribute(
            'customColor',
            new THREE.BufferAttribute(this.edgeVertices[0].bufferRef, 3, true),
        );
        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(this.edgeVertices[1].bufferRef, 3),
        );
        this.geometry.setDrawRange(0, this.shouldRender ? this.edgeVertices[1].size : 0);
        this.geometry.attributes['customColor'].needsUpdate = true;
        this.geometry.attributes['position'].needsUpdate = true;

        this.geometry.computeBoundingBox();
        this.geometry.computeBoundingSphere();
        return true;
    }

    protected generateMaterial() {
        const material = this.dashedLines
            ? new THREE.ShaderMaterial({
                  //   color: 0xffffff,
                  //   linewidth: 1,
                  //   vertexColors: true,
                  //   scale: 1,
                  //   dashSize: 1,
                  //   gapSize: 3,
                  vertexShader: ChannelShader.vertexShader,
                  fragmentShader: ChannelShader.fragmentShader,
              })
            : new THREE.ShaderMaterial({
                  //   color: 0xffffff,
                  //   linewidth: 1,
                  //   vertexColors: true,

                  vertexShader: ChannelShader.vertexShader,
                  fragmentShader: ChannelShader.fragmentShader,
              });

        material.depthTest = this.depthTest;
        return material;
    }

    protected newObject3DInstance(): THREE.LineSegments {
        const material = this.dashedLines
            ? new THREE.LineDashedMaterial({
                  color: 0xffffff,
                  linewidth: 1,
                  vertexColors: false,
                  scale: 1,
                  dashSize: 1,
                  gapSize: 3,
              })
            : new THREE.LineBasicMaterial({
                  color: 0xffffff,
                  linewidth: 1,
                  vertexColors: false,
              });

        material.depthTest = this.depthTest;

        // const geometry = new THREE.BufferGeometry()
        //     .setFromPoints(this.shouldRender ? this.edgeVertices : [])
        //     .scale(100, 100, 100);
        // geometry.setAttribute(
        //     'color',
        //     new THREE.BufferAttribute(this.edgeColor || new Uint8Array(), 3, true),
        // );

        this.generateGeometry();
        const mesh = new THREE.LineSegments(this.geometry, material);
        //mesh.computeLineDistances();
        mesh.renderOrder = -1;
        return mesh;
    }
}
