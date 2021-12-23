import { Component, Input, OnChanges, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import { NodePositionRegistryService } from 'src/app/services/node-position-registry.service';
import { LnGraphNode } from 'src/app/types/graph.interface';
import * as THREE from 'three';

@Component({
  selector: 'app-custom-mesh-line',
  providers: [provideParent(SphereMeshComponent)],
  template: '<ng-content></ng-content>',
})
export class CustomMeshLineComponent extends AbstractObject3D<THREE.Object3D> implements OnChanges {

  @Input() public nodes: LnGraphNode[] = [];

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

  protected newObject3DInstance(): THREE.Points {
    
    const t0 = performance.now();
    for(let i = 0; i < this.nodes.length; i++){
      this.nodePositionRegistryService.pushSpherePoint(i, this.nodes[i].pub_key);
    }
    const t1 = performance.now();
    console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);


    const geometry = new THREE.BufferGeometry().setFromPoints( Object.values(this.nodePositionRegistryService.nodePosition) );

    const material = new THREE.PointsMaterial( { color: 0x0000ff, size: 1, sizeAttenuation: true } );
    // const material = this.getMaterial();
    const line = new THREE.Points( geometry, material );
    // this.applyShadowProps(mesh);
    return line;
  }

}
