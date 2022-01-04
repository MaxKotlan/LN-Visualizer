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
    RaycasterService,
    RendererService,
    SphereMeshComponent,
} from 'atft';
import { take } from 'rxjs';
import { searchGraph } from 'src/app/actions/controls.actions';
import { GraphState } from 'src/app/reducers/graph.reducer';
// import { selectClosestPoint } from 'src/app/selectors/graph.selectors';
import { LndRaycasterService } from 'src/app/services/lnd-raycaster-service';
import * as THREE from 'three';
import { BufferAttribute } from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

@Component({
    selector: 'app-graph-node-mesh',
    providers: [provideParent(SphereMeshComponent)],
    template: '<ng-content></ng-content>',
})
export class GraphNodeMeshComponent
    extends AbstractObject3D<THREE.Points | THREE.Mesh>
    implements OnChanges, OnInit
{
    @Input() positions!: Float32Array | null;
    @Input() colors!: Uint8Array | null;
    @Input() shouldRender: boolean = true;
    @Input() pointSizeAttenuation: boolean = true;
    @Input() useSprite: boolean = true;
    @Input() spriteSize: number = 3;

    @Output() mouseEnter = new EventEmitter<RaycasterEmitEvent>();
    @Output() mouseExit = new EventEmitter<RaycasterEmitEvent>();
    @Output() click = new EventEmitter<RaycasterEmitEvent>();

    private geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    private material: THREE.PointsMaterial | null = null;

    constructor(
        protected override rendererService: RendererService,
        @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
        private raycasterService: LndRaycasterService,
        private store$: Store<GraphState>,
    ) {
        super(rendererService, parent);
    }

    protected spriteTexture: THREE.Texture | undefined;

    override ngOnInit(): void {
        this.spriteTexture = new THREE.TextureLoader().load('assets/Lightning_Network_dark.svg');
        super.ngOnInit();
        this.raycasterService.addGroup(this);
        this.subscribeEvents();
    }

    private subscribeEvents() {
        const obj = this.getObject();
        obj.addEventListener(RaycasterEvent.mouseEnter, this.onMouseEnter.bind(this));
        obj.addEventListener(RaycasterEvent.mouseExit, this.onMouseExit);
        obj.addEventListener(RaycasterEvent.click, this.onClick.bind(this));
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
        // this.store$.select(selectClosestPoint(intersection.point)).subscribe((node) => {
        //   this.store$.dispatch(searchGraph({searchText: node.alias}));
        //   console.log('Closest Node is: ', node);
        // })
        // const intersection = (event as THREE.Intersection);
        // this.store$.select(selectClosestPoint(intersection.point)).pipe(take(1)).subscribe((node) => {
        //   this.store$.dispatch(searchGraph({searchText: node.alias}));
        // })
    }

    private onClick(event: any) {
        // const intersection = event as THREE.Intersection;
        // this.store$
        //     .select(selectClosestPoint(intersection.point))
        //     .pipe(take(1))
        //     .subscribe((node) => {
        //         this.store$.dispatch(searchGraph({ searchText: node.alias }));
        //     });
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
        return this.generatePointGeometry();
    }

    protected generatePointGeometryReal() {
        if (!this.positions) return;
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setDrawRange(0, 6000);
        this.geometry.attributes['position'].needsUpdate = true;

        if (!this.colors) return;
        this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
        this.geometry.setDrawRange(0, 6000);
        this.geometry.attributes['color'].needsUpdate = true;

        // this.geometry.setAttribute(
        //     'color',
        //     new BufferAttribute(this.colors || new Uint8Array([]), 3, false),
        // );
        this.geometry.computeBoundingBox();
        //this.geometry.computeBoundingSphere();
        //this.geometry.attributes['color'].needsUpdate = true;
        // this.colorData.array = this.colors || new Uint8Array([]);
        // this.colorData.itemSize = 3;
        // this.colorData.count = (this.colors || new Uint8Array([])).length;
        // this.geometry.attributes['color'] = this.colorData;
        // this.geometry.attributes['color'].needsUpdate = true;
        return this.geometry;
    }

    protected generateMaterial() {
        if (!this.material)
            this.material = new THREE.PointsMaterial({
                size: this.spriteSize,
                sizeAttenuation: this.pointSizeAttenuation,
                map: this.useSprite ? this.spriteTexture : undefined,
                vertexColors: true,
                alphaTest: 0.5,
                transparent: this.useSprite ? true : false,
            });
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
