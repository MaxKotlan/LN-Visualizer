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
import { animationFrames, map, take, TimestampProvider } from 'rxjs';
import { searchGraph } from 'src/app/modules/controls/actions/controls.actions';
import { ToolTipService } from 'src/app/services/tooltip.service';
import { BufferRef } from 'src/app/types/bufferRef.interface';
import * as THREE from 'three';
import { GraphState } from '../../reducer';
import { selectClosestPoint } from '../../selectors';
import { LndRaycasterService } from '../../services';
import { NodeBuffersService } from '../../services/node-buffers/node-buffers.service';
import { NodeShader } from '../../shaders';

@Component({
    selector: 'app-graph-node-mesh',
    providers: [provideParent(SphereMeshComponent)],
    template: '<ng-content></ng-content>',
})
export class GraphNodeMeshComponent
    extends AbstractObject3D<THREE.Points | THREE.Mesh>
    implements OnChanges, OnInit
{
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

    constructor(
        protected override rendererService: RendererService,
        @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
        private raycasterService: LndRaycasterService,
        private store$: Store<GraphState>,
        public toolTipService: ToolTipService,
        private nodeBuffersService: NodeBuffersService,
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

        animationFrames(customTSProvider)
            .pipe(map(({ elapsed }) => Math.sin(elapsed * 0.01)))
            .subscribe((elapsed) => (this.material.uniforms['sinTime'] = { value: elapsed }));

        //console.log('ddd', this.getObject());
        this.nodeBuffersService.vertex.onUpdate.subscribe(() => {
            this.initializePart1();
            this.geometry.attributes['position'].needsUpdate = true;
        });

        this.nodeBuffersService.color.onUpdate.subscribe(() => {
            this.initializePart1();
            this.geometry.attributes['nodeColor'].needsUpdate = true;
        });

        this.nodeBuffersService.capacity.onUpdate.subscribe(() => {
            this.initializePart1();

            this.geometry.attributes['averageCapacityRatio'].needsUpdate = true;
        });
    }

    private subscribeEvents() {
        const obj = this.getObject();
        obj.addEventListener(RaycasterEvent.mouseEnter, this.onMouseEnter.bind(this));
        obj.addEventListener(RaycasterEvent.mouseExit, this.onMouseExit.bind(this));
        obj.addEventListener(RaycasterEvent.click, this.onClick.bind(this));
    }

    private onMouseExit() {
        this.toolTipService.close();
        document.body.style.cursor = null as unknown as string;
    }

    private onMouseEnter(event: any) {
        document.body.style.cursor = 'pointer';
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

    public initializePart1() {
        const obj: THREE.Object3D = this.getObject();
        if (obj) {
            (obj as any)['geometry'] = this.generatePointGeometryReal();
            //const newInstance = this.newObject3DInstance();
            //(obj as any)['geometry'] = newInstance.geometry;
            // (obj as any)['material'] = this.generateMaterial();
        }
        //(obj as any)['material'].needsUpdate = true;
    }

    // override ngOnChanges(simpleChanges: SimpleChanges) {
    //     // const obj: THREE.Object3D = this.getObject();
    //     // if (obj) {
    //     //     this.generatePointGeometryReal();
    //     //     (obj as any)['geometry'] = this.geometry;
    //     //     //const newInstance = this.newObject3DInstance();
    //     //     //(obj as any)['geometry'] = newInstance.geometry;
    //     //     (obj as any)['material'] = this.generateMaterial();
    //     //     //(obj as any)['material'].needsUpdate = true;
    //     // }
    //     //this.rendererService.render();
    //     //super.ngOnChanges(simpleChanges);
    // }

    protected newObject3DInstance(): THREE.Points | THREE.Mesh {
        this.generatePointGeometryReal();
        return this.generatePointGeometry();
    }

    protected initializeBufferAtribbutes() {
        this.geometry.setAttribute(
            'nodeColor',
            new THREE.BufferAttribute(this.nodeBuffersService.color.data, 3, true),
        );
        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                this.shouldRender ? this.nodeBuffersService.vertex.data : new Float32Array(),
                3,
            ),
        );
        this.geometry.setAttribute(
            'averageCapacityRatio',
            new THREE.BufferAttribute(
                this.nodeBuffersService.capacity.data || new Float32Array(),
                1,
                false,
            ),
        );
    }

    protected generatePointGeometryReal() {
        this.initializeBufferAtribbutes();
        this.geometry.setDrawRange(0, this.nodeBuffersService.vertex.size);
        this.geometry.attributes['nodeColor'].needsUpdate = true;
        this.geometry.attributes['position'].needsUpdate = true;
        this.geometry.computeBoundingBox();
        this.geometry.computeBoundingSphere();
        return this.geometry;
    }

    protected generateMaterial() {
        if (!this.material) {
            const wowShader = NodeShader;
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
        return new THREE.Points(this.geometry, this.generateMaterial());
    }
}
