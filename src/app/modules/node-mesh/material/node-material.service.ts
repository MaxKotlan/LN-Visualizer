import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { meshScale } from 'src/app/constants/mesh-scale.constant';
import * as THREE from 'three';
import { Uniform, Vector3 } from 'three';
import {
    selectMinimumNodeSize,
    selectNodeSize,
    selectPointAttenuation,
    selectUniformNodeSize,
} from '../../controls-node/selectors/node-controls.selectors';
import { setMouseRay } from '../../controls-renderer/actions';
import { selectNodeMotionIntensity } from '../../controls-renderer/selectors';
import { GraphState } from '../../graph-renderer/reducer';
import { selectFinalPositionFromSearch } from '../../graph-renderer/selectors';
import { AnimationTimeService } from '../../graph-renderer/services/animation-timer/animation-time.service';
import { NodeShader } from '../shaders';
import { NodeTextures } from '../textures/lightning-node-texture.service';

@Injectable({
    providedIn: 'root',
})
export class NodeMaterial extends THREE.ShaderMaterial {
    protected spriteTexture: THREE.Texture | undefined;

    constructor(
        private store$: Store<GraphState>,
        private animationTimeService: AnimationTimeService,
        private nodeTextures: NodeTextures,
        private actions: Actions,
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

        this.store$
            .select(selectFinalPositionFromSearch)
            .subscribe((position) => (this.uniforms['motionOrigin'] = position));

        this.actions.pipe(ofType(setMouseRay)).subscribe((ray) => {
            this.uniforms['mouseRayOrigin'] = new Uniform(
                ray.value.origin || new THREE.Vector3(0, 0, 0),
            );
            this.uniforms['mouseRayDirection'] = new Uniform(
                ray.value.direction || new THREE.Vector3(0, 0, 0),
            );
        });
    }
}
