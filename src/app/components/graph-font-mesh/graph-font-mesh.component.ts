import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { AbstractLazyObject3D, AbstractObject3D, appliedMaterial, fixCenter, FontService, provideParent, RendererService, SphereMeshComponent } from 'atft';
import * as THREE from 'three';
import TextSprite from '@seregpie/three.text-sprite';
import { Object3D } from 'three';

@Component({
  selector: 'app-graph-font-mesh',
  providers: [provideParent(SphereMeshComponent)],
  template: '<ng-content></ng-content>',
})
export class GraphFontMeshComponent extends AbstractObject3D<THREE.Object3D> implements OnChanges, OnInit {
  // @Input() positions: THREE.Vector3[] = [];
  // @Input() colors: any;


  // @Input()
  // material = 'basic';

  // private _materialColor: string | number = '#DADADA';
  // @Input()
  // set materialColor(materialColor: string | number) {
  //   this._materialColor = materialColor;
  //   if (this.object) {
  //     // console.log('TextMeshComponent.set materialColor', materialColor + ' / ' + this.name);
  //     this.startLoading();
  //   }
  // }

  // get materialColor() {
  //   return this._materialColor;
  // }

  // private _text = 'Text';
  // @Input()
  // set text(text: string) {
  //   this._text = text;
  //   if (this.object) {
  //     // console.log('TextMeshComponent.set text', text + ' / ' + this.name);
  //     this.startLoading();
  //   }
  // }

  // get text() {
  //   return this._text;
  // }


  // @Input()
  // size = 10;

  // @Input()
  // height = 0.3;

  // @Input()
  // curveSegments = 2;

  // @Input()
  // bevelEnabled = false;

  // @Input()
  // bevelThickness = 0.1;

  // @Input()
  // bevelSize = 0.1;

  // @Input()
  // bevelOffset = 0;

  // @Input()
  // bevelSegments = 1;

  // @Input()
  // fontUrl = './assets/helvetiker_regular.typeface.json';

  // @Input()
  // castShadow = true;

  // @Input()
  // receiveShadow = true;

  // @Input()
  // depthWrite = true;

  // @Input()
  // centered = true;

  // protected fontCache: THREE.Font | undefined;

  // constructor(
  //   protected override rendererService: RendererService,
  //   @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
  //   protected font: FontService
  // ) {
  //   super(rendererService, parent);
  // }

  // public getMaterial(): THREE.Material {
  //   return appliedMaterial(this.materialColor, this.material, this.depthWrite);
  // }

  // protected async loadLazyObject(): Promise<THREE.Object3D> {
  //   // console.log('TextMeshComponent.loadLazyObject', this.name);

  //   const font = await this.font.load(this.fontUrl);
  //   // console.log('TextMeshComponent.loadLazyObject font', font);
  //   return this.getTextMesh(font);
  // }

  // protected getTextMesh(font: THREE.Font): THREE.Mesh {
  //   // console.log('TextMeshComponent.getTextMesh', this.text + ' / ' + this.name);
  //   if (this.text) {
  //     const geometry = new THREE.TextGeometry(this.text, {
  //       font: font,
  //       size: this.size,
  //       height: this.height,
  //       curveSegments: this.curveSegments,
  //       bevelEnabled: this.bevelEnabled,
  //       bevelThickness: this.bevelThickness,
  //       bevelSize: this.bevelSize,
  //       bevelOffset: this.bevelOffset,
  //       bevelSegments: this.bevelOffset
  //     });

  //     const material = this.getMaterial();
  //     const mesh = new THREE.Mesh(geometry, material);
  //     mesh.castShadow = this.castShadow;
  //     mesh.receiveShadow = this.receiveShadow;

  //     if (this.centered) {
  //       fixCenter(mesh);
  //     }
  //     return mesh;
  //   } else {
  //     return new THREE.Mesh();
  //   }

  // }

  //*********************************************** */

  @Input() positions: THREE.Vector3[] = [];
  @Input() aliases: string[] = [];
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


  override ngOnInit(): void {
      super.ngOnInit();
  }

  override ngOnChanges(simpleChanges: SimpleChanges){
    // let obj: THREE.Object3D = this.getObject();
    // if (obj){
    //   (obj) = this.newObject3DInstance();
    //   this.rendererService.getScene().addChild(obj);
    // }
    super.ngOnInit();
    super.ngAfterViewInit();

    this.rendererService.render();
    super.ngOnChanges(simpleChanges);
  }

  protected newObject3DInstance(): THREE.Object3D {

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

      //geomAccum = [];

      // for (let i = 0; i < 10; i++){
      //   geomA

      let obj3d = new Object3D();

      for (let i = 0; i < 100; i++){
        const instance = new TextSprite({
          alignment: 'left',
          color: '#ffffff',
          fontFamily: '"Arial", Arial, sansserif',
          fontSize: 1,
          // fontStyle: 'italic',
          text: this.aliases[i],
        });
        instance.translateX(this.positions[i].x*100);
        instance.translateY(this.positions[i].y*100);
        instance.translateZ(this.positions[i].z*100);
        obj3d = obj3d.add(instance);
      }
      console.log(obj3d)

      //instance.geometry.translate(2,1,1);
      //}



      //console.log(instance)

      // const textMaterial = new THREE.MeshPhongMaterial( 
      //   { color: 0xff0000, specular: 0xffffff }
      // );
      //console.log((this.rendererService.getScene(). ))//.addChild(instance as any)
      // const mesh = new THREE.Mesh( geometry, textMaterial );
      // return mesh;
      //const line = new THREE.Mesh( geometry, material );
      // const obj = new Object3D();
      // obj.
      //obj.add(instance);

      // const map = new THREE.TextureLoader().load( 'assets/disc.png' );
      // const material = new THREE.SpriteMaterial( { map: map } );

      // const sprite = new THREE.Sprite( material );
      //console.log(instance)

      return obj3d;
    //});
    }
}
