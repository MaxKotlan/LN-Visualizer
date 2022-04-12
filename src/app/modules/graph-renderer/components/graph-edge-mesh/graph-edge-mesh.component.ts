import { Component, Input, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import {
    selectEdgeDepthTest,
    selectEdgeDottedLine,
    shouldRenderEdges,
} from 'src/app/modules/controls-channel/selectors';
import { setMouseRay } from 'src/app/modules/controls-renderer/actions';
import { selectNodeMotionIntensity } from 'src/app/modules/controls-renderer/selectors';
import * as THREE from 'three';
import { Uniform } from 'three';
import { GraphState } from '../../reducer';
import { selectFinalPositionFromSearch } from '../../selectors/graph.selectors';
import { AnimationTimeService } from '../../services/animation-timer/animation-time.service';
import { ChannelBuffersService } from '../../services/channel-buffers/channel-buffers.service';
import { ChannelShader } from '../../shaders';

@UntilDestroy()
@Component({
    selector: 'app-graph-edge-mesh',
    providers: [provideParent(SphereMeshComponent)],
    template: '<ng-content></ng-content>',
})
export class GraphEdgeMeshComponent extends AbstractObject3D<THREE.LineSegments> {
    dashedLines: boolean = true;
    depthTest: boolean = true;

    private geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    private material: THREE.ShaderMaterial;

    constructor(
        protected override rendererService: RendererService,
        private channelBufferService: ChannelBuffersService,
        private store$: Store<GraphState>,
        private animationTimeService: AnimationTimeService,
        private actions: Actions,
        @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
    ) {
        super(rendererService, parent);
    }

    protected updateGeometry() {
        this.geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(this.channelBufferService.color.data, 3, true),
        );
        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(this.channelBufferService.vertex.data, 3),
        );
        this.geometry.attributes['color'].needsUpdate = true;
        this.geometry.attributes['position'].needsUpdate = true;
        this.geometry.computeBoundingBox();
        this.geometry.computeBoundingSphere();
    }

    protected generateMaterial() {
        const wowShader = ChannelShader;
        const material = new THREE.ShaderMaterial(wowShader);

        material.depthTest = this.depthTest;
        this.material = material;
    }

    protected newObject3DInstance(): THREE.LineSegments {
        this.updateGeometry();
        this.generateMaterial();
        const mesh = new THREE.LineSegments(this.geometry, this.material);
        mesh.renderOrder = -1;
        this.handleUpdates();
        return mesh;
    }

    private handleUpdates() {
        let currentDrawRange;
        let currentShouldRender;

        this.animationTimeService.sinTime$.subscribe(
            (elapsed) => (this.material.uniforms['sinTime'] = { value: elapsed }),
        );

        // this.channelBufferService.vertex.onUpdate.subscribe((drawRange) => {
        //     currentDrawRange = drawRange;
        //     this.updateGeometry();
        //     this.geometry.setDrawRange(0, currentShouldRender ? drawRange : 0);
        //     this.rendererService.render();
        // });

        //Update position and color buffers on color buffer update
        this.channelBufferService.color.onUpdate.subscribe((drawRange) => {
            currentDrawRange = drawRange;
            this.updateGeometry();
            this.geometry.setDrawRange(0, currentShouldRender ? drawRange : 0);
            this.rendererService.render();
        });

        this.actions.pipe(ofType(setMouseRay)).subscribe((ray) => {
            this.material.uniforms['mouseRayOrigin'] = new Uniform(
                ray.value.origin || new THREE.Vector3(0, 0, 0),
            );
            this.material.uniforms['mouseRayDirection'] = new Uniform(
                ray.value.direction || new THREE.Vector3(0, 0, 0),
            );
        });

        this.store$.select(selectFinalPositionFromSearch).subscribe((position) => {
            this.material.uniforms['motionOrigin'] = position;
        });

        this.store$.select(shouldRenderEdges).subscribe((shouldRender) => {
            currentShouldRender = shouldRender;
            this.geometry.setDrawRange(0, currentShouldRender ? currentDrawRange : 0);
            this.rendererService.render();
        });

        this.store$.select(selectNodeMotionIntensity).subscribe((intensity) => {
            this.material.uniforms['motionIntensity'] = { value: intensity };
        });

        this.store$.select(selectEdgeDottedLine).subscribe((renderDottedLine) => {
            this.dashedLines = renderDottedLine;
            this.generateMaterial();
            this.rendererService.render();
        });

        this.store$.select(selectEdgeDepthTest).subscribe((depthTest) => {
            this.depthTest = depthTest;
            this.material.depthTest = depthTest;
            this.material.needsUpdate = true;
            this.rendererService.render();
        });
    }
}
