import { Component, Input, Optional, SkipSelf } from '@angular/core';
import { AbstractMesh, AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import * as THREE from 'three';

@Component({
  selector: 'app-custom-mesh-line',
  providers: [provideParent(SphereMeshComponent)],
  template: '<ng-content></ng-content>',
})
export class CustomMeshLineComponent extends AbstractObject3D<THREE.Object3D> {

  @Input() radius: number | undefined;
  @Input() widthSegments: number | undefined;
  @Input() hightSegments: number | undefined;

  constructor(
    protected override rendererService: RendererService,
    @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>
  ) {
    super(rendererService, parent);
  }

  protected newObject3DInstance(): THREE.Line {
    // console.log('SphereMeshComponent.newObject3DInstance');
    const points = [];
    points.push( new THREE.Vector3( - 10, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 10, 0 ) );
    points.push( new THREE.Vector3( 10, 0, 0 ) );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    // const material = this.getMaterial();
    const line = new THREE.Line( geometry, material );
    // this.applyShadowProps(mesh);
    return line;
  }

}
