import { Component, EventEmitter, Input, OnChanges, OnInit, Optional, Output, SimpleChanges, SkipSelf } from '@angular/core';
import { AbstractObject3D, provideParent, RaycasterEmitEvent, RaycasterEvent, RaycasterService, RendererService, SphereMeshComponent } from 'atft';
import { LndRaycasterService } from 'src/app/services/lnd-raycaster-service';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

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

  @Output() mouseEnter = new EventEmitter<RaycasterEmitEvent>();
  @Output() mouseExit = new EventEmitter<RaycasterEmitEvent>();
  @Output() click = new EventEmitter<RaycasterEmitEvent>();
  
  constructor(
    protected override rendererService: RendererService,
    @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
    private raycasterService: LndRaycasterService
  ) {
    super(rendererService, parent);
  }

  protected spriteTexture: THREE.Texture | undefined;

  override ngOnInit(): void {
      this.spriteTexture = new THREE.TextureLoader().load( "assets/Lightning_Network_dark.svg" );
      super.ngOnInit();
      this.raycasterService.addGroup(this);
      this.subscribeEvents();
  
  }

  private subscribeEvents() {
    const obj = this.getObject();
    obj.addEventListener(RaycasterEvent.mouseEnter, this.onMouseEnter);
    obj.addEventListener(RaycasterEvent.mouseExit, this.onMouseExit);
    obj.addEventListener(RaycasterEvent.click, this.onClick);
  }

  private onMouseExit() {
    // this.mouseExit.emit({
    //   component: this
    // });
  }

  private onMouseEnter(event: any) {
    //console.log('RaycasterGroupDirective.onMouseEnter', event);
    // this.mouseEnter.emit({
    //   component: this,
    //   face: event.face
    // });
  }

  private onClick(event: any) {
    console.log('onClick', event);
    // this.click.emit({
    //   component: this,
    //   face: event.face
    // });
  }


  override ngOnChanges(simpleChanges: SimpleChanges){
    const obj: THREE.Object3D = this.getObject();
    if (obj){
      const newInstance = this.newObject3DInstance();
      (obj as any)['geometry'] = newInstance.geometry;
      (obj as any)['material'] = newInstance.material;
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
  
    let wow: THREE.BufferGeometry = new THREE.BufferGeometry();
    let sphereGeometries: THREE.BufferGeometry[] = [];

    const sphere = new THREE.SphereGeometry( this.spriteSize, 8, 4 );

    this.positions.forEach((center: THREE.Vector3) => {

      const matrix = new THREE.Matrix4().set(
        1,0,0,center.x*100,
        0,1,0,center.y*100,
        0,0,1,center.z*100,
        0,0,0,1,
      );

      let geom = sphere.clone().applyMatrix4(matrix);
      geom = geom.deleteAttribute('uv');
      //wow.merge(geom);

      wow = BufferGeometryUtils.mergeBufferGeometries([wow, geom], false)
      // console.log(geom);

      // sphereGeometries.push(
      //   geom
      // );
    });

    
    //const geometry = BufferGeometryUtils.mergeBufferGeometries(sphereGeometries, false);
    //geometry.setAttribute('color', new THREE.BufferAttribute( this.colors, 3, true));
    //geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvCoordinates), 2));
    //geometry.computeVertexNormals();
    //geometry.setDrawRange(0, newCoords.length);

    const txtmap = new THREE.TextureLoader().load( 'assets/txttest.png' );

    const material = new THREE.MeshBasicMaterial({
      //map: txtmap,
      //alphaTest: 0.5,
      transparent: false,
      color: '#FFFFFF',
      //depthWrite: true,
      //side: THREE.DoubleSide
    });
    return new THREE.Mesh(wow, material);
  }
}
