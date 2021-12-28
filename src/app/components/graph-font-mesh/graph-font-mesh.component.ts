import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { AbstractLazyObject3D, AbstractObject3D, appliedMaterial, fixCenter, FontService, provideParent, RendererService, SphereMeshComponent } from 'atft';
import * as THREE from 'three';
import TextSprite from '@seregpie/three.text-sprite';
import { BufferAttribute, BufferGeometry, DoubleSide, MeshBasicMaterial, Object3D, PointsMaterial, SpriteMaterial, Vector3 } from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import TextTexture from '@seregpie/three.text-texture';

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

    const txtmap = new THREE.TextureLoader().load( 'assets/txttest.png' );

    
    //console.log(newCoords)
    let texture = new TextTexture({
      alignment: 'center',
      color: '#fff',
      fontFamily: 'sans-serif',    
      fontSize: 32,
      fontStyle: 'italic',
      text: 'Hello World',
    });

		// if (texture.checkFontFace()) {
		// 	let {
		// 		height,
		// 		width,
		// 	} = texture;
		// 	if (width && height) {
		// 		//texture.setX(width).setY(height);
		// 		//texture.setOptimalPixelRatio(this, renderer, camera);
		// 		texture.redraw();
		// 	} else {
		// 		//scale.setScalar(1);
		// 	}
		// } else {
		texture.loadFontFace();
    texture.redraw();
		//}


    console.log(texture)
    //texture.repeat.set(0.5, 1);
    // scale x2 vertical
    //texture.flipY = false;
    //texture.repeat.set(0.1, 0.1);
    // scale x2 proportional
        //texture.setOptimalPixelRatio()

    const geometry = new THREE.BufferGeometry().setFromPoints(newCoords);
    geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvCoordinates), 2));
    geometry.computeVertexNormals();
    geometry.setDrawRange(0, newCoords.length);
    geometry.addGroup(0, 3, 0);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      alphaTest: 0.5,
      transparent: false,
      color: '#FFFFFF',
      depthWrite: false,
   });
    return new THREE.Mesh(geometry, material);
  }

  old(): THREE.Object3D {

      //const fontStuff = 
      //const test = new THREE.Font();



      const test = new THREE.TextureLoader().load( "assets/disc.png" )
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

      //let obj3d = new Object3D();

      let spriteAccum = new TextSprite({text: this.aliases[0]}, new THREE.MeshBasicMaterial({ transparent: false })); 

      //const buffgeom: BufferGeometry = new BufferGeometry(); 

      for (let i = 0; i < 8; i++){
        const instance = new TextSprite({
          alignment: 'left',
          color: '#ffffff',
          fontFamily: '"Arial", Arial, sansserif',
          fontSize: 1,
          text: this.aliases[i],
        });

        const deserializeBufferSpriteAccumulator = spriteAccum.geometry.getAttribute('position').toJSON();
        const deserializedArraySpriteAccumulator = (deserializeBufferSpriteAccumulator as any).array as number[];

        const deserializeBufferSpriteAccumulatorUv = spriteAccum.geometry.getAttribute('uv').toJSON();
        const deserializedArraySpriteAccumulatorUv = (deserializeBufferSpriteAccumulatorUv as any).array as number[];

        const deserializeBuffer = instance.geometry.getAttribute('position').toJSON();
        const deserializedArray = (deserializeBuffer as any).array as number[];

        const deserializeBufferInstanceUv = instance.geometry.getAttribute('uv').toJSON();
        const deserializedArrayInstanceUv = (deserializeBufferInstanceUv as any).array as number[];

        console.log(spriteAccum.geometry.getAttribute('uv'))

        const newPositioned = deserializedArray.map((value, index) => {

          switch(index%3){
            case 0: //console.log('Increment by X');
              return value + this.positions[i].x * 1;
              break;
            case 1: //console.log('Increment by Y');
              return value + this.positions[i].y * 1;
              break;
            case 2: //console.log('Increment by Z');
              return value + this.positions[i].z * 1;
              break;
          }

          //console.log('shouldBeX', )
          return value + this.positions[i].x * 0
        });
        

        let concatindatedBuffers;
        if (i > 0)
          concatindatedBuffers = [...deserializedArraySpriteAccumulator, ...newPositioned];
        else
          concatindatedBuffers = newPositioned;

        let concatindatedUvBuffers;
        //if (i > 0)
          concatindatedUvBuffers = [...deserializedArraySpriteAccumulatorUv, ...deserializedArrayInstanceUv];
        //else
        //  concatindatedUvBuffers = deserializedArrayInstanceUv;

        console.log('concatbuff', deserializedArrayInstanceUv)

        spriteAccum.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(
          concatindatedBuffers
        ),3, false))
          
        spriteAccum.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(
          concatindatedUvBuffers
        ),4, false));

        (spriteAccum.geometry as THREE.BufferGeometry).attributes['position'].needsUpdate = true;
        (spriteAccum.geometry as THREE.BufferGeometry).setDrawRange( 0, concatindatedBuffers.length);
        //spriteAccum.geometry.ge

        //spriteAccum.geometry.setAttribute('position', yooo);

        //spriteAccum.geometry.setAttribute('position', instance.geometry.getAttribute('position'))

        //spriteAccum.geometry.addGroup(0,20, 0);
        
        //spriteAccum.geometry = 
        //BufferGeometryUtils.mergeBufferAttributes([...instance.geometry.attributes]);
        //spriteAccum.geometry.computeVertexNormals();
        //spriteAccum.material.
        console.log(spriteAccum.geometry)
        spriteAccum.material.map  = instance.material.map
        //spriteAccum.geometry.addGroup(0, 2, 0)
       // spriteAccum = instance;
        //spriteAccum.geometry = geom.

        //obj3d = obj3d.add(instance);
      }
      //console.log(obj3d)

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

      //const map = new THREE.TextureLoader().load( 'assets/disc.png' );
      // const material = new THREE.SpriteMaterial( { map: map } );

      // const sprite = new THREE.Sprite( material );
      //console.log(instance)

      // const geometry = new THREE.BufferGeometry().setFromPoints( this.shouldRender ? this.positions: [] );//.scale(100,100,100);
      // console.log('complex', geometry)

      
      //geometry.setAttribute('color', new THREE.BufferAttribute( this.colors, 3, true));
      //console.log(spriteAccum.material.map)
      //const material = new THREE.PointsMaterial( { size: 10, sizeAttenuation: true, map: spriteAccum.material.map, alphaMap: spriteAccum.material.alphaMap, transparent: true, alphaTest: 0.5});//, sizeAttenuation: this.pointSizeAttenuation, map: this.useSprite? this.spriteTexture : undefined, vertexColors: true, alphaTest: 0.5, transparent: this.useSprite? true : false } );
      //const line = new THREE.Points( geometry, material );
      //console.log(line)
      return spriteAccum;

      //return obj3d;
    //});
    }
}
