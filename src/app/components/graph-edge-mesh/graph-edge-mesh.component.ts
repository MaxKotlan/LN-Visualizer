import { Component, Input, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import {
    AbstractMesh,
    AbstractObject3D,
    provideParent,
    RendererService,
    SphereMeshComponent,
} from 'atft';
import { selecteCorrectEdgePublicKey } from 'src/app/reducers/graph.reducer';
import { NodePositionRegistryService } from 'src/app/services/node-position-registry.service';
import { BufferRef } from 'src/app/types/bufferRef.interface';
import { LnGraphEdge, LnGraphNode, LnModifiedGraphNode } from 'src/app/types/graph.interface';
import * as THREE from 'three';

@Component({
    selector: 'app-graph-edge-mesh',
    providers: [provideParent(SphereMeshComponent)],
    template: '<ng-content></ng-content>',
})
export class GraphEdgeMeshComponent extends AbstractObject3D<THREE.LineSegments> {
    @Input() public edgeVertices: BufferRef<Float32Array> | null = null;
    @Input() shouldRender: boolean = false;
    @Input() edgeColor: Uint8Array | null = null;
    @Input() dashedLines: boolean = true;
    @Input() depthTest: boolean = false;

    private geometry: THREE.BufferGeometry = new THREE.BufferGeometry();

    constructor(
        protected override rendererService: RendererService,
        protected nodePositionRegistryService: NodePositionRegistryService,
        @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
    ) {
        super(rendererService, parent);
    }

    override ngOnChanges(simpleChanges: SimpleChanges) {
        const obj: THREE.LineSegments = this.getObject();
        //console.log('loledgecnt', this.edgeVertices);
        if (obj) {
            //const newInstance = this.newObject3DInstance();
            this.generateGeometry();
            (obj as any)['geometry'] = this.geometry;
            (obj as any)['material'] = this.generateMaterial();
            obj.geometry.computeBoundingBox();
            obj.computeLineDistances();
        }
        this.rendererService.render();
        super.ngOnChanges(simpleChanges);
    }

    protected generateGeometry() {
        if (!this.edgeVertices) return;
        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(this.edgeVertices.bufferRef, 3),
        );
        this.geometry.setDrawRange(0, this.edgeVertices.size);
        this.geometry.attributes['position'].needsUpdate = true;
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
                  vertexColors: false,
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
