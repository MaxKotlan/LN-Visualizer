import { Component, Input, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { AbstractMesh, AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import { NodePositionRegistryService } from 'src/app/services/node-position-registry.service';
import { LnGraphEdge, LnGraphNode, LnModifiedGraphNode } from 'src/app/types/graph.interface';
import * as THREE from 'three';

@Component({
  selector: 'app-graph-edge-mesh',
  providers: [provideParent(SphereMeshComponent)],
  template: '<ng-content></ng-content>',
})
export class GraphEdgeMeshComponent extends AbstractObject3D<THREE.Object3D> {

  @Input() public edges: LnGraphEdge[] = [];
  @Input() public nodes: Record<string, LnModifiedGraphNode> = {};
  @Input() shouldRender: boolean = false;
  @Input() edgeColor: Uint8Array | null = null;
  @Input() dashedLines: boolean = true;

  constructor(
    protected override rendererService: RendererService,
    protected nodePositionRegistryService: NodePositionRegistryService,
    @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>
  ) {
    super(rendererService, parent);
  }

  override ngOnChanges(simpleChanges: SimpleChanges){
    const obj: THREE.Object3D = this.getObject();
    if (obj){
      (obj as any)['geometry'] = this.newObject3DInstance().geometry;
    }
    this.rendererService.render();
    super.ngOnChanges(simpleChanges);
  }

  protected newObject3DInstance(): THREE.LineSegments {

    const pointData: THREE.Vector3[] = []

    for(let i = 0; i < this.edges.length; i++){

      if (this.nodes[this.edges[i].node1_pub])
        pointData.push(this.nodes[this.edges[i].node1_pub].postition)

      if (this.nodes[this.edges[i].node2_pub])
        pointData.push(this.nodes[this.edges[i].node2_pub].postition)
    };
    
    const material = this.dashedLines ? 
    new THREE.LineDashedMaterial( {
      color: 0xFFFFFF,
      linewidth: 1,
      vertexColors: true,
      scale: 1,
      dashSize: 1,
      gapSize: 3,    
    } ) :
    new THREE.LineBasicMaterial( {
      color: 0xFFFFFF,
      linewidth: 1,
      vertexColors: true,
    } );

    const geometry = new THREE.BufferGeometry().setFromPoints(this.shouldRender ? pointData : []).scale(100,100,100);
    geometry.setAttribute('color', new THREE.BufferAttribute( this.edgeColor || new Uint8Array(), 3, true));
    const mesh = new THREE.LineSegments(geometry, material);
    mesh.computeLineDistances();
    return mesh;
  }

}
