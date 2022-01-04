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
import { LnGraphEdge, LnGraphNode, LnModifiedGraphNode } from 'src/app/types/graph.interface';
import * as THREE from 'three';

@Component({
    selector: 'app-graph-edge-mesh',
    providers: [provideParent(SphereMeshComponent)],
    template: '<ng-content></ng-content>',
})
export class GraphEdgeMeshComponent extends AbstractObject3D<THREE.Object3D> {
    @Input() public edgeVertices: THREE.Vector3[] = [];
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
        const obj: THREE.Object3D = this.getObject();
        if (obj) {
            //const newInstance = this.newObject3DInstance();
            (obj as any)['geometry'] = this.geometry;
            (obj as any)['material'] = this.generateMaterial();
        }
        this.rendererService.render();
        super.ngOnChanges(simpleChanges);
    }

    protected generateGeometry() {
        this.geometry
            .setFromPoints(this.shouldRender ? this.edgeVertices : [])
            .scale(100, 100, 100);
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
        return material;
    }

    protected newObject3DInstance(): THREE.LineSegments {
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

        const geometry = new THREE.BufferGeometry()
            .setFromPoints(this.shouldRender ? this.edgeVertices : [])
            .scale(100, 100, 100);
        geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(this.edgeColor || new Uint8Array(), 3, true),
        );
        const mesh = new THREE.LineSegments(geometry, material);
        mesh.computeLineDistances();
        mesh.renderOrder = -1;
        return mesh;
    }
}
