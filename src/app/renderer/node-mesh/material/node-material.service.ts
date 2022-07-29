import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { meshScale } from 'src/app/constants/mesh-scale.constant';
import * as THREE from 'three';
import { Uniform, Vector3 } from 'three';
import {
    selectMinimumNodeSize,
    selectNodeSize,
    selectPointAttenuation,
    selectUniformNodeSize,
} from 'src/app/ui/settings/controls-node/selectors/node-controls.selectors';
import { selectNodeMotionIntensity } from 'src/app/ui/settings/controls-renderer/selectors';
import { NodeSearchEffects } from 'src/app/renderer/graph-renderer/effects/node-search.effects';
import { GraphState } from 'src/app/renderer/graph-renderer/reducer';
import { AnimationTimeService } from 'src/app/renderer/graph-renderer/services/animation-timer/animation-time.service';
import { NodeShader } from '../shaders';
import { NodeTextures } from '../textures/lightning-node-texture.service';

@Injectable({
    providedIn: 'root',
})
export class NodeMaterial extends THREE.ShaderMaterial {
    constructor(
        private store$: Store<GraphState>,
        private animationTimeService: AnimationTimeService,
        private nodeTextures: NodeTextures,
        private nodeSearchEffects: NodeSearchEffects,
    ) {
        super(NodeShader);
        this.uniforms['pointTexture'] = { value: this.nodeTextures.getTexture('lightningIcon') };
        this.handleUpdates();
    }

    public handleHoverUpdate(position: Vector3) {
        this.uniforms['hoverOrigin'] = new Uniform(position.clone().multiplyScalar(meshScale));
    }

    private handleUpdates() {
        this.animationTimeService.sinTime$.subscribe(
            (elapsed) => (this.uniforms['sinTime'] = { value: elapsed }),
        );

        this.animationTimeService.cosTime$.subscribe(
            (elapsed) => (this.uniforms['cosTime'] = { value: elapsed }),
        );

        this.store$
            .select(selectPointAttenuation)
            .subscribe(
                (pointAttenuation) =>
                    (this.uniforms['pointAttenuation'] = { value: pointAttenuation }),
            );

        this.store$
            .select(selectUniformNodeSize)
            .subscribe((uniformSize) => (this.uniforms['uniformSize'] = { value: uniformSize }));

        this.store$
            .select(selectNodeSize)
            .subscribe((nodeSize) => (this.uniforms['size'] = { value: nodeSize }));

        this.store$
            .select(selectMinimumNodeSize)
            .subscribe((minimumSize) => (this.uniforms['minimumSize'] = { value: minimumSize }));

        this.store$.select(selectNodeMotionIntensity).subscribe((intensity) => {
            const updatedIntensity = intensity / 1000.0;
            this.uniforms['motionIntensity'] = { value: updatedIntensity };
        });

        this.nodeSearchEffects.selectFinalPositionFromSearch$.subscribe((position) => {
            this.uniforms['motionOrigin'] = position;
            //for some reason I need to do this for the uniform to update
            this.dispose();
        });

        // this.actions.pipe(ofType(setMouseRay)).subscribe((ray) => {
        //     this.uniforms['mouseRayOrigin'] = new Uniform(
        //         ray.value.origin || new THREE.Vector3(0, 0, 0),
        //     );
        //     this.uniforms['mouseRayDirection'] = new Uniform(
        //         ray.value.direction || new THREE.Vector3(0, 0, 0),
        //     );
        // });
    }
}
