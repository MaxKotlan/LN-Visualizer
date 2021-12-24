import { Component, Input, OnChanges, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import { NodePositionRegistryService } from 'src/app/services/node-position-registry.service';
import { LnGraphNode } from 'src/app/types/graph.interface';
import * as THREE from 'three';

@Component({
  selector: 'app-graph-node-mesh',
  providers: [provideParent(SphereMeshComponent)],
  template: '<ng-content></ng-content>',
})
export class GraphNodeMeshComponent extends AbstractObject3D<THREE.Object3D> implements OnChanges {

  @Input() positions: THREE.Vector3[] = [];
  @Input() colors: any;
  @Input() shouldRender: boolean = true;

  constructor(
    protected override rendererService: RendererService,
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

  protected newObject3DInstance(): THREE.Points {
    const geometry = new THREE.BufferGeometry().setFromPoints( this.shouldRender ? this.positions: [] );
    geometry.setAttribute('color', new THREE.BufferAttribute( this.colors, 3, true));

    const material = new THREE.PointsMaterial( { size: 2, sizeAttenuation: false, vertexColors: true } );
    const line = new THREE.Points( geometry, material );
    return line;
  }

}
