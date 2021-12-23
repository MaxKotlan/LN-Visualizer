import { Component, Input, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { AbstractMesh, AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import { NodePositionRegistryService } from 'src/app/services/node-position-registry.service';
import { LnGraphEdge, LnGraphNode } from 'src/app/types/graph.interface';
import * as THREE from 'three';

@Component({
  selector: 'app-custom-mesh-test',
  providers: [provideParent(SphereMeshComponent)],
  template: '<ng-content></ng-content>',
})
export class CustomMeshTestComponent extends AbstractObject3D<THREE.Object3D> {

  @Input() public edges: LnGraphEdge[] = [];

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
      console.log(obj)
    }
    this.rendererService.render();
    super.ngOnChanges(simpleChanges);
  }

  protected newObject3DInstance(): THREE.LineSegments {

    const pointData: THREE.Vector3[] = []

    const t0 = performance.now();
    for(let i = 0; i < this.edges.length; i++){
      pointData.push(this.nodePositionRegistryService.nodePosition[this.edges[i].node1_pub])
      pointData.push(this.nodePositionRegistryService.nodePosition[this.edges[i].node2_pub])
    };
    const t1 = performance.now();
    console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);


    const largestCapacity = Math.max(...this.edges.map((e) => parseInt(e.capacity)));

    console.log('Largest Capacity', largestCapacity)

    const colTemp = this.edges
      .map((edge: LnGraphEdge) => [
        (1-(parseInt(edge.capacity) / largestCapacity)) * 50000+25,  
        (parseInt(edge.capacity) / largestCapacity) * 50000+25, 
        40])
      .map(a => [...a,...a])
      .flat()
    const colors = new Uint8Array(colTemp);

    const material = new THREE.LineBasicMaterial( {
      color: 0xFFFFFF,
      linewidth: 1,
      vertexColors: true,
      // linecap: 'round', //ignored by WebGLRenderer
      // linejoin:  'round' //ignored by WebGLRenderer
    } );

    console.log('da point data', pointData)

    const geometry = new THREE.BufferGeometry().setFromPoints(pointData);
    geometry.setAttribute('color', new THREE.BufferAttribute( colors, 3, true));
    const mesh = new THREE.LineSegments(geometry, material);
    return mesh;
  }

}
