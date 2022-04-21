import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as THREE from 'three';
import { Uniform } from 'three';
import { selectEdgeDepthTest } from '../../controls-channel/selectors';
import { setMouseRay } from '../../controls-renderer/actions';
import { selectNodeMotionIntensity } from '../../controls-renderer/selectors';
import { NodeSearchEffects } from '../../graph-renderer/effects/node-search.effects';
import { GraphState } from '../../graph-renderer/reducer';
import { AnimationTimeService } from '../../graph-renderer/services/animation-timer/animation-time.service';
import { ChannelShader } from '../shaders';

@Injectable({
    providedIn: 'root',
})
export class ChannelMaterial extends THREE.ShaderMaterial {
    constructor(
        private animationTimeService: AnimationTimeService,
        private actions: Actions,
        private store$: Store<GraphState>,
        private nodeSearch: NodeSearchEffects,
    ) {
        super(ChannelShader);
        this.handleUpdates();
    }

    private handleUpdates() {
        this.animationTimeService.sinTime$.subscribe(
            (elapsed) => (this.uniforms['sinTime'] = { value: elapsed }),
        );

        this.animationTimeService.cosTime$.subscribe(
            (elapsed) => (this.uniforms['cosTime'] = { value: elapsed }),
        );

        this.actions.pipe(ofType(setMouseRay)).subscribe((ray) => {
            this.uniforms['mouseRayOrigin'] = new Uniform(
                ray.value.origin || new THREE.Vector3(0, 0, 0),
            );
            this.uniforms['mouseRayDirection'] = new Uniform(
                ray.value.direction || new THREE.Vector3(0, 0, 0),
            );
        });

        this.nodeSearch.selectFinalPositionFromSearch$.subscribe((position) => {
            this.uniforms['motionOrigin'] = position;
        });

        this.store$.select(selectNodeMotionIntensity).subscribe((intensity) => {
            const updatedIntensity = intensity / 1000.0;
            this.uniforms['motionIntensity'] = { value: updatedIntensity };
        });

        this.store$.select(selectEdgeDepthTest).subscribe((depthTest) => {
            this.depthTest = depthTest;
        });
    }
}
