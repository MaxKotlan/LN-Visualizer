import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import * as THREE from 'three';
import TextSprite from '@seregpie/three.text-sprite';

@Component({
  selector: 'app-graph-font-mesh',
  providers: [provideParent(SphereMeshComponent)],
  template: '<ng-content></ng-content>',
})
export class GraphFontMeshComponent extends AbstractObject3D<THREE.Object3D> implements OnChanges, OnInit {

  @Input() positions: THREE.Vector3[] = [];
  @Input() colors: any;
  @Input() shouldRender: boolean = true;
  @Input() pointSizeAttenuation: boolean = true;
  @Input() useSprite: boolean = true;
  @Input() spriteSize: number = 3;

  constructor(
    protected override rendererService: RendererService,
    @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
    protected http: HttpClient
  ) {
    super(rendererService, parent);
  }

  // protected spriteTexture: THREE.Texture | undefined;


  override async ngOnInit(): Promise<void> {
      // this.spriteTexture = new THREE.TextureLoader().load( "assets/lato.png" );

      const fontData = await this.http.get('assets/helvetiker_regular.typeface.json');

      super.ngOnInit();
  }

  override ngOnChanges(simpleChanges: SimpleChanges){
    const obj: THREE.Object3D = this.getObject();
    if (obj){
      (obj as any)['geometry'] = this.newObject3DInstance().geometry;
    }
    this.rendererService.render();
    super.ngOnChanges(simpleChanges);
  }

  protected newObject3DInstance(): THREE.Sprite {

      //const fontStuff = 
      //const test = new THREE.Font();



      //new THREE.TextureLoader().load( "assets/Lightning_Network_dark.svg" )

      //await http

      //loader.load( 'assets/helvetiker_regular.typeface.json');//, function ( font ) {
      
      // const geometry = new TextGeometry( 'Hello three.js!', {
      //   font: this.font,
      //   size: 80,
      //   height: 5,
      //   curveSegments: 12,
      //   bevelEnabled: true,
      //   bevelThickness: 10,
      //   bevelSize: 8,
      //   bevelOffset: 0,
      //   bevelSegments: 5
      // } );

      let instance = new TextSprite({
        alignment: 'left',
        color: '#24ff00',
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: 8,
        fontStyle: 'italic',
        text: [
          'Twinkle, twinkle, little star,',
          'How I wonder what you are!',
          'Up above the world so high,',
          'Like a diamond in the sky.',
        ].join('\n'),
      });

      console.log(instance)

      // const textMaterial = new THREE.MeshPhongMaterial( 
      //   { color: 0xff0000, specular: 0xffffff }
      // );
      //console.log((this.rendererService.getScene(). ))//.addChild(instance as any)
      // const mesh = new THREE.Mesh( geometry, textMaterial );
      // return mesh;
      //const line = new THREE.Mesh( geometry, material );
      return instance;
    //});
    }
}
