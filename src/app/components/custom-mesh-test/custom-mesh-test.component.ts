import { Component, Input, Optional, SkipSelf } from '@angular/core';
import { AbstractMesh, AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import * as THREE from 'three';

@Component({
  selector: 'app-custom-mesh-test',
  providers: [provideParent(SphereMeshComponent)],
  template: '<ng-content></ng-content>',
})
export class CustomMeshTestComponent extends AbstractMesh {

  @Input() radius: number | undefined;
  @Input() widthSegments: number | undefined;
  @Input() hightSegments: number | undefined;

  constructor(
    protected override rendererService: RendererService,
    @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>
  ) {
    super(rendererService, parent);
  }

  protected newObject3DInstance(): THREE.Mesh {
    // console.log('SphereMeshComponent.newObject3DInstance');
    const geometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.hightSegments);
    const material = this.getMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    this.applyShadowProps(mesh);
    return mesh;
  }

}
