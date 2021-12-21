import { Component, Input, Optional, SkipSelf } from '@angular/core';
import { AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
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

  protected newObject3DInstance(): THREE.Points {
    // console.log('SphereMeshComponent.newObject3DInstance');
    const points = [];

    const range = 100;

    for (let i = 0; i < 50186; i++)
      points.push( new THREE.Vector3(Math.floor(i/range)*(Math.cos(Math.random()*2*Math.PI)), 0, Math.floor(i/range)*(Math.sin(Math.random()*2*Math.PI))) );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const material = new THREE.PointsMaterial( { color: 0x0000ff } );
    // const material = this.getMaterial();
    const line = new THREE.Points( geometry, material );
    // this.applyShadowProps(mesh);
    return line;
  }

}
