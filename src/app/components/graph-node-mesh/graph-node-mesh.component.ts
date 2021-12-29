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
export class GraphNodeMeshComponent extends AbstractObject3D<THREE.Points | THREE.Mesh> implements OnChanges, OnInit {

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

  protected newObject3DInstance(): THREE.Points | THREE.Mesh {
    return this.generatePointGeometry();
  }

  protected generatePointGeometry(): THREE.Points {
    const geometry = new THREE.BufferGeometry().setFromPoints( this.shouldRender ? this.positions: [] ).scale(100,100,100);
    geometry.setAttribute('color', new THREE.BufferAttribute( this.colors, 3, true));

    const material = new THREE.PointsMaterial( { size: this.spriteSize, sizeAttenuation: this.pointSizeAttenuation, map: this.useSprite? this.spriteTexture : undefined, vertexColors: true, alphaTest: 0.5, transparent: this.useSprite? true : false } );
    return new THREE.Points( geometry, material );
  }

  protected generateSphereGeometry(): THREE.Mesh {
    
    const sizeX = 4;
    const sizeY = 2;

    const sizeXHalf = sizeX/2;
    const sizeYHalf = sizeY/2;

    const newCoords = this.positions.flatMap((center: THREE.Vector3) => {
      const centerCpy = center.clone().multiplyScalar(100);
      return [
        centerCpy.clone().add(new THREE.Vector3(-sizeXHalf, sizeYHalf, 0)),
        centerCpy.clone().add(new THREE.Vector3(-sizeXHalf,-sizeYHalf, 0)),
        centerCpy.clone().add(new THREE.Vector3( sizeXHalf,-sizeYHalf, 0)),
        centerCpy.clone().add(new THREE.Vector3( sizeXHalf,-sizeYHalf, 0)),
        centerCpy.clone().add(new THREE.Vector3( sizeXHalf, sizeYHalf, 0)),
        centerCpy.clone().add(new THREE.Vector3(-sizeXHalf, sizeYHalf, 0)),
      ]
    });

    const uvCoordinates = this.positions.flatMap((center: THREE.Vector3) => {
      return [
         0,1,
         0,0,
         1,0,
         1,0,
         1,1,
         0,1,
      ]
    });
    
    const geometry = new THREE.BufferGeometry().setFromPoints(this.shouldRender? newCoords: []);
    geometry.setAttribute('color', new THREE.BufferAttribute( this.colors, 3, true));
    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvCoordinates), 2));
    geometry.computeVertexNormals();
    geometry.setDrawRange(0, newCoords.length);

    const txtmap = new THREE.TextureLoader().load( 'assets/txttest.png' );

    const material = new THREE.MeshBasicMaterial({
      map: txtmap,
      alphaTest: 0.5,
      transparent: false,
      color: '#FFFFFF',
      depthWrite: true,
      side: THREE.DoubleSide
    });
    return new THREE.Mesh(geometry, material);
  }
}
