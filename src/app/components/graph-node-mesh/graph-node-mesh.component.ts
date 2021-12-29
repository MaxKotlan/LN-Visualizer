import { Component, Input, OnChanges, OnInit, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import { NodePositionRegistryService } from 'src/app/services/node-position-registry.service';
import { LnGraphNode } from 'src/app/types/graph.interface';
import * as THREE from 'three';

@Component({
  selector: 'app-graph-node-mesh',
  providers: [provideParent(SphereMeshComponent)],
  template: '<ng-content></ng-content>',
})
export class GraphNodeMeshComponent extends AbstractObject3D<THREE.Object3D> implements OnChanges, OnInit {

  @Input() positions: THREE.Vector3[] = [];
  @Input() colors: any;
  @Input() shouldRender: boolean = true;
  @Input() pointSizeAttenuation: boolean = true;
  @Input() useSprite: boolean = true;
  @Input() spriteSize: number = 3;

  constructor(
    protected override rendererService: RendererService,
    @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>
  ) {
    super(rendererService, parent);
  }

  protected spriteTexture: THREE.Texture | undefined;

  override ngOnInit(): void {
      this.spriteTexture = new THREE.TextureLoader().load( "assets/Lightning_Network_dark.svg" );
      super.ngOnInit();
  }

  override ngOnChanges(simpleChanges: SimpleChanges){
    const obj: THREE.Object3D = this.getObject();
    if (obj){
      (obj as any)['geometry'] = this.newObject3DInstance().geometry;
      (obj as any)['material'] = this.newObject3DInstance().material;
    }
    this.rendererService.render();
    super.ngOnChanges(simpleChanges);
  }

  protected newObject3DInstance(): THREE.Points {
    return this.generatePointGeometry();
  }

  protected generatePointGeometry(): THREE.Points {
    const geometry = new THREE.BufferGeometry().setFromPoints( this.shouldRender ? this.positions: [] ).scale(100,100,100);
    geometry.setAttribute('color', new THREE.BufferAttribute( this.colors, 3, true));

    const material = new THREE.PointsMaterial( { size: this.spriteSize, sizeAttenuation: this.pointSizeAttenuation, map: this.useSprite? this.spriteTexture : undefined, vertexColors: true, alphaTest: 0.5, transparent: this.useSprite? true : false } );
    return new THREE.Points( geometry, material );
  }

}
