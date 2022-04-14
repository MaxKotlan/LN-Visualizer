import {
    Component,
    EventEmitter,
    OnChanges,
    OnInit,
    Optional,
    Output,
    SkipSelf,
} from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
    AbstractObject3D,
    provideParent,
    RaycasterEmitEvent,
    RaycasterEvent,
    RendererService,
    SphereMeshComponent,
} from 'atft';
import { take } from 'rxjs';
import { meshScale } from 'src/app/constants/mesh-scale.constant';
import {
    selectMinimumNodeSize,
    selectNodeSize,
    selectPointAttenuation,
    selectUniformNodeSize,
    shouldRenderNodes,
} from 'src/app/modules/controls-node/selectors/node-controls.selectors';
import { setMouseRay } from 'src/app/modules/controls-renderer/actions';
import { selectNodeMotionIntensity } from 'src/app/modules/controls-renderer/selectors';
import { searchGraph } from 'src/app/modules/controls/actions/controls.actions';
import { ToolTipService } from 'src/app/services/tooltip.service';
import * as THREE from 'three';
import { Uniform, Vector3 } from 'three';
import { GraphState } from '../../reducer';
import { selectClosestPoint, selectFinalPositionFromSearch } from '../../selectors';
import { LndRaycasterService } from '../../services';
import { AnimationTimeService } from '../../services/animation-timer/animation-time.service';
import { NodeBuffersService } from '../../services/node-buffers/node-buffers.service';
import { NodeShader } from '../../shaders';
import { NodePoint } from '../../three-js-objects/NodePoint';

@Component({
    selector: 'app-graph-node-mesh',
    providers: [provideParent(SphereMeshComponent)],
    template: '<ng-content></ng-content>',
})
export class GraphNodeMeshComponent
    extends AbstractObject3D<NodePoint>
    implements OnChanges, OnInit
{
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
        private animationTimeService: AnimationTimeService,
        private actions: Actions,
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
    }

    private subscribeEvents() {
        const obj = this.getObject();
        obj.addEventListener(RaycasterEvent.mouseEnter, this.onMouseEnter.bind(this));
        obj.addEventListener(RaycasterEvent.mouseExit, this.onMouseExit.bind(this));
        obj.addEventListener(RaycasterEvent.click, this.onClick.bind(this));
    }

    private onMouseExit() {
        this.handleHoverUpdate(new Vector3(0, 0, 0));
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
                this.handleHoverUpdate(node.position);
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

    protected newObject3DInstance(): NodePoint {
        this.updateGeometry();
        this.generateMaterial();
        const mesh = new NodePoint(this.geometry, this.material);
        this.object = mesh;
        this.handleUpdates();
        this.handleHoverUpdate(new Vector3(0, 0, 0));
        return mesh;
    }

    private handleHoverUpdate(position: Vector3) {
        this.material.uniforms['hoverOrigin'] = new Uniform(
            position.clone().multiplyScalar(meshScale),
        );
    }

    private handleUpdates() {
        let currentDrawRange;
        let currentShouldRender = true;

        this.animationTimeService.sinTime$.subscribe((elapsed) => {
            this.material.uniforms['sinTime'] = { value: elapsed };
            this.object?.setSinTime(elapsed);
        });

        this.animationTimeService.cosTime$.subscribe((elapsed) => {
            this.material.uniforms['cosTime'] = { value: elapsed };
            this.object?.setCosTime(elapsed);
        });

        this.store$.select(selectPointAttenuation).subscribe((pointAttenuation) => {
            this.material.uniforms['pointAttenuation'] = { value: pointAttenuation };
        });

        this.store$.select(selectUniformNodeSize).subscribe((uniformSize) => {
            this.material.uniforms['uniformSize'] = { value: uniformSize };
        });

        this.store$.select(selectNodeSize).subscribe((nodeSize) => {
            this.material.uniforms['size'] = { value: nodeSize };
        });

        this.store$.select(selectMinimumNodeSize).subscribe((minimumSize) => {
            this.material.uniforms['minimumSize'] = { value: minimumSize };
        });

        this.store$.select(selectNodeMotionIntensity).subscribe((intensity) => {
            const updatedIntensity = intensity / 1000.0;
            this.material.uniforms['motionIntensity'] = { value: updatedIntensity };
            this.object?.setMotionIntenstiy(updatedIntensity);
        });

        this.store$.select(selectFinalPositionFromSearch).subscribe((position) => {
            this.material.uniforms['motionOrigin'] = position;
            this.object?.setMotionOrigin(position.value);
        });

        this.actions.pipe(ofType(setMouseRay)).subscribe((ray) => {
            this.material.uniforms['mouseRayOrigin'] = new Uniform(
                ray.value.origin || new THREE.Vector3(0, 0, 0),
            );
            this.material.uniforms['mouseRayDirection'] = new Uniform(
                ray.value.direction || new THREE.Vector3(0, 0, 0),
            );
        });

        this.nodeBuffersService.vertex.onUpdate.subscribe((drawRange) => {
            currentDrawRange = drawRange;
            this.updateGeometry();
            this.geometry.setDrawRange(0, currentShouldRender ? drawRange : 0);
            this.rendererService.render();
        });

        this.store$.select(shouldRenderNodes).subscribe((shouldRender) => {
            currentShouldRender = shouldRender;
            this.geometry.setDrawRange(0, currentShouldRender ? currentDrawRange : 0);
            this.rendererService.render();
        });

        this.nodeBuffersService.color.onUpdate.subscribe(() => {
            this.geometry.attributes['nodeColor'].needsUpdate = true;
            this.rendererService.render();
        });

        this.nodeBuffersService.capacity.onUpdate.subscribe(() => {
            this.geometry.attributes['averageCapacityRatio'].needsUpdate = true;
            this.rendererService.render();
        });
    }

    protected updateGeometry() {
        this.geometry.setAttribute(
            'nodeColor',
            new THREE.BufferAttribute(this.nodeBuffersService.color.data, 3, true),
        );
        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(this.nodeBuffersService.vertex.data, 3),
        );
        this.geometry.setAttribute(
            'averageCapacityRatio',
            new THREE.BufferAttribute(this.nodeBuffersService.capacity.data, 1, false),
        );
        this.geometry.attributes['position'].needsUpdate = true;
        this.geometry.attributes['nodeColor'].needsUpdate = true;
        this.geometry.attributes['averageCapacityRatio'].needsUpdate = true;
        this.geometry.computeBoundingBox();
        this.geometry.computeBoundingSphere();
    }

    protected generateMaterial() {
        const nodeShader = NodeShader;
        nodeShader.uniforms['pointTexture'] = { value: this.spriteTexture };
        nodeShader.uniforms['size'] = { value: 20 };
        nodeShader.uniforms['uniformSize'] = { value: true };
        this.material = new THREE.ShaderMaterial(nodeShader);
        this.material.uniforms['size'] = { value: 20 };
        this.material.alphaTest = 0.5;
        this.material.transparent = true;
        this.material.needsUpdate = true;
    }
}
