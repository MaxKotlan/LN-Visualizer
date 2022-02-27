import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Optional,
    Output,
    SimpleChanges,
    SkipSelf,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
    AbstractObject3D,
    provideParent,
    RaycasterEmitEvent,
    RaycasterEvent,
    RendererService,
    SphereMeshComponent,
} from 'atft';
import { take, TimestampProvider } from 'rxjs';
import { searchGraph } from 'src/app/modules/controls/actions/controls.actions';
import { ToolTipService } from 'src/app/services/tooltip.service';
import { BufferRef } from 'src/app/types/bufferRef.interface';
import * as THREE from 'three';
import { GraphState } from '../../reducer';
import { selectClosestPoint } from '../../selectors';
import { LndRaycasterService } from '../../services';
import { BasicShader } from '../../shaders';

@Component({
    selector: 'app-graph-node-mesh',
    providers: [provideParent(SphereMeshComponent)],
    template: '<ng-content></ng-content>',
})
export class GraphNodeMeshComponent
    extends AbstractObject3D<THREE.Points | THREE.Mesh>
    implements OnChanges, OnInit
{
    @Input() positions!: BufferRef<Float32Array> | null;
    @Input() colors!: BufferRef<Uint8Array> | null;

    private capBuff: BufferRef<Float32Array> | undefined;

    @Input() set capacity(newCapacity: BufferRef<Float32Array> | null) {
        if (!newCapacity) return;
        this.capBuff = newCapacity;
        if (!this.geometry.attributes['averageCapacityRatio']) return;
        this.geometry.attributes['averageCapacityRatio'].needsUpdate = true;
    }

    @Input() set uniformNodeSize(uniformNodeSize: boolean) {
        if (!this.material) return;
        this.material.uniforms['uniformSize'] = { value: uniformNodeSize };
    }

    @Input() set minimumNodeSize(minimumNodeSize: number) {
        if (!this.material) return;
        this.material.uniforms['minimumSize'] = { value: minimumNodeSize };
    }

    @Input() shouldRender: boolean = true;
    @Input() set pointSizeAttenuation(pointAttenuation: boolean) {
        if (!this.material) return;
        this.material.uniforms['pointAttenuation'] = { value: pointAttenuation };
    }
    @Input() useSprite: boolean = true;
    @Input() spriteSize: number = 3;

    @Output() mouseEnter = new EventEmitter<RaycasterEmitEvent>();
    @Output() mouseExit = new EventEmitter<RaycasterEmitEvent>();
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() click = new EventEmitter<RaycasterEmitEvent>();

    private geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    private material: THREE.ShaderMaterial | null = null;
    private materialMoving: any;

    constructor(
        protected override rendererService: RendererService,
        @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
        private raycasterService: LndRaycasterService,
        private store$: Store<GraphState>,
        public toolTipService: ToolTipService,
    ) {
        super(rendererService, parent);
    }

    protected spriteTexture: THREE.Texture | undefined;

    override ngOnInit(): void {
        this.spriteTexture = new THREE.TextureLoader().load('assets/Lightning_Network_dark.svg');
        this.spriteTexture.flipY = false;
        super.ngOnInit();
        this.raycasterService.addGroup(this);
        this.subscribeEvents();

        let now = 0;
        const customTSProvider: TimestampProvider = {
            now() {
                return now++;
            },
        };

        // animationFrames(customTSProvider)
        //     .pipe(map(({ elapsed }) => Math.sin(elapsed * 0.01)))
        //     .subscribe((elapsed) => (this.material.uniforms['sinTime'] = { value: elapsed }));
    }

    private subscribeEvents() {
        const obj = this.getObject();
        obj.addEventListener(RaycasterEvent.mouseEnter, this.onMouseEnter.bind(this));
        obj.addEventListener(RaycasterEvent.mouseExit, this.onMouseExit.bind(this));
        obj.addEventListener(RaycasterEvent.click, this.onClick.bind(this));
    }

    private onMouseExit() {
        // this.mouseExit.emit({
        //   component: this
        // });
        //document.body.style.cursor = '';
        this.toolTipService.close();
        document.body.style.cursor = null as unknown as string;
    }

    private onMouseEnter(event: any) {
        document.body.style.cursor = 'pointer';
        //console.log('RaycasterGroupDirective.onMouseEnter', event);
        // this.mouseEnter.emit({
        //   component: this,
        //   face: event.face
        // });
        // this.store$.select(selectClosestPoint(intersection.point)).subscribe((node) => {
        //   this.store$.dispatch(searchGraph({searchText: node.alias}));
        //   console.log('Closest Node is: ', node);
        // })
        // const intersection = (event as THREE.Intersection);
        // this.store$.select(selectClosestPoint(intersection.point)).pipe(take(1)).subscribe((node) => {
        //   this.store$.dispatch(searchGraph({searchText: node.alias}));
        // })
        const intersection = event as THREE.Intersection;
        this.store$
            .select(selectClosestPoint(intersection.point))
            .pipe(take(1))
            .subscribe((node) => {
                if (!node) return;
                this.toolTipService.open(
                    event.mouseEvent.clientX,
                    event.mouseEvent.clientY,
                    node.alias,
                );
            });
    }

    private onClick(event: any) {
        const intersection = event as THREE.Intersection;
        this.store$
            .select(selectClosestPoint(intersection.point))
            .pipe(take(1))
            .subscribe((node) => {
                if (!node) return;
                this.toolTipService.close();
                console.log(node);
                this.store$.dispatch(searchGraph({ searchText: node.public_key }));
            });
    }

    override ngOnChanges(simpleChanges: SimpleChanges) {
        const obj: THREE.Object3D = this.getObject();
        if (obj) {
            this.generatePointGeometryReal();
            (obj as any)['geometry'] = this.geometry;
            //const newInstance = this.newObject3DInstance();
            //(obj as any)['geometry'] = newInstance.geometry;
            (obj as any)['material'] = this.generateMaterial();
            //(obj as any)['material'].needsUpdate = true;
        }
        this.rendererService.render();
        super.ngOnChanges(simpleChanges);
    }

    protected newObject3DInstance(): THREE.Points | THREE.Mesh {
        this.generatePointGeometryReal();
        return this.generatePointGeometry();
    }

    protected generatePointGeometryReal() {
        if (!this.positions) return;
        if (!this.colors) return;
        this.geometry.setAttribute(
            'nodeColor',
            new THREE.BufferAttribute(this.colors.bufferRef, 3, true),
        );
        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                this.shouldRender ? this.positions.bufferRef : new Float32Array(),
                3,
            ),
        );
        this.geometry.setAttribute(
            'averageCapacityRatio',
            new THREE.BufferAttribute(this.capBuff?.bufferRef || new Float32Array(), 1, false),
        );
        this.geometry.setDrawRange(0, this.positions.size);
        this.geometry.attributes['nodeColor'].needsUpdate = true;
        this.geometry.attributes['position'].needsUpdate = true;
        // this.geometry.setAttribute(
        //     'color',
        //     new BufferAttribute(this.colors || new Uint8Array([]), 3, false),
        // );
        this.geometry.computeBoundingBox();
        this.geometry.computeBoundingSphere();
        //console.log('NEW POOSS', this.positions.size);
        //this.geometry.attributes['color'].needsUpdate = true;
        // this.colorData.array = this.colors || new Uint8Array([]);
        // this.colorData.itemSize = 3;
        // this.colorData.count = (this.colors || new Uint8Array([])).length;
        // this.geometry.attributes['color'] = this.colorData;
        // this.geometry.attributes['color'].needsUpdate = true;
        return this.geometry;
    }

    protected generateMaterial() {
        if (!this.material) {
            const wowShader = BasicShader;
            wowShader.uniforms['pointTexture'] = { value: this.spriteTexture };
            wowShader.uniforms['size'] = { value: this.spriteSize };
            wowShader.uniforms['uniformSize'] = { value: false };

            this.material = new THREE.ShaderMaterial(
                wowShader,
                //{

                //size: this.spriteSize,
                // sizeAttenuation: this.pointSizeAttenuation,
                // map: this.useSprite ? this.spriteTexture : undefined,
                // vertexColors: true,
                // alphaTest: 0.5,
                // transparent: this.useSprite ? true : false,
                //}
            );
        }
        // this.material.size = this.spriteSize;
        // this.material.sizeAttenuation = this.pointSizeAttenuation;
        // (this.material.map = this.useSprite ? this.spriteTexture || null : null),
        //     (this.material.vertexColors = true);
        this.material.uniforms['size'] = { value: this.spriteSize };

        this.material.alphaTest = 0.5;
        this.material.transparent = this.useSprite;
        this.material.needsUpdate = true;

        // this.materialMoving = extendMaterial.extendMaterial(this.material, {
        //     vertexShader: '',
        //     fragmentShader: '',
        // });

        return this.material;
    }

    protected generatePointGeometry(): THREE.Points {
        // const geometry = new THREE.BufferGeometry()
        //     .setFromPoints(this.shouldRender ? this.positions : [])
        //     .scale(100, 100, 100);
        // geometry.setAttribute(
        //     'color',
        //     new THREE.BufferAttribute(this.colors || new Uint8Array([]), 3, true),
        // );

        return new THREE.Points(this.geometry, this.generateMaterial());
    }

    // protected generateSphereGeometry(): THREE.Mesh {
    //     let wow: THREE.BufferGeometry = new THREE.BufferGeometry();
    //     let sphereGeometries: THREE.BufferGeometry[] = [];

    //     const sphere = new THREE.SphereGeometry(this.spriteSize, 8, 4);

    //     this.positions.forEach((center: THREE.Vector3) => {
    //         const matrix = new THREE.Matrix4().set(
    //             1,
    //             0,
    //             0,
    //             center.x * 100,
    //             0,
    //             1,
    //             0,
    //             center.y * 100,
    //             0,
    //             0,
    //             1,
    //             center.z * 100,
    //             0,
    //             0,
    //             0,
    //             1,
    //         );

    //         let geom = sphere.clone().applyMatrix4(matrix);
    //         geom = geom.deleteAttribute('uv');
    //         //wow.merge(geom);

    //         wow = BufferGeometryUtils.mergeBufferGeometries([wow, geom], false);
    //         // console.log(geom);

    //         // sphereGeometries.push(
    //         //   geom
    //         // );
    //     });

    //     //const geometry = BufferGeometryUtils.mergeBufferGeometries(sphereGeometries, false);
    //     //geometry.setAttribute('color', new THREE.BufferAttribute( this.colors, 3, true));
    //     //geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvCoordinates), 2));
    //     //geometry.computeVertexNormals();
    //     //geometry.setDrawRange(0, newCoords.length);

    //     const txtmap = new THREE.TextureLoader().load('assets/txttest.png');

    //     const material = new THREE.MeshBasicMaterial({
    //         //map: txtmap,
    //         //alphaTest: 0.5,
    //         transparent: false,
    //         color: '#FFFFFF',
    //         //depthWrite: true,
    //         //side: THREE.DoubleSide
    //     });
    //     return new THREE.Mesh(wow, material);
    // }
}
