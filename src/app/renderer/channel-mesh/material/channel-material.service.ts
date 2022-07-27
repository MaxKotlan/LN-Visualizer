import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as THREE from 'three';
import { Uniform } from 'three';
import {
    selectEdgeDepthTest,
    selectEnableChannelFog,
    selectFogDistance,
} from 'src/app/modules/controls-channel/selectors';
import { setMouseRay } from 'src/app/modules/controls-renderer/actions';
import { selectNodeMotionIntensity } from 'src/app/modules/controls-renderer/selectors';
import { NodeSearchEffects } from 'src/app/renderer/graph-renderer/effects/node-search.effects';
import { GraphState } from 'src/app/renderer/graph-renderer/reducer';
import { AnimationTimeService } from 'src/app/renderer/graph-renderer/services/animation-timer/animation-time.service';
import { ChannelShader } from '../shaders';

@UntilDestroy()
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
        this.animationTimeService.sinTime$
            .pipe(untilDestroyed(this))
            .subscribe((elapsed) => (this.uniforms['sinTime'] = { value: elapsed }));

        this.animationTimeService.cosTime$
            .pipe(untilDestroyed(this))
            .subscribe((elapsed) => (this.uniforms['cosTime'] = { value: elapsed }));

        this.actions
            .pipe(ofType(setMouseRay))
            .pipe(untilDestroyed(this))
            .subscribe((ray) => {
                this.uniforms['mouseRayOrigin'] = new Uniform(
                    ray.value.origin || new THREE.Vector3(0, 0, 0),
                );
                this.uniforms['mouseRayDirection'] = new Uniform(
                    ray.value.direction || new THREE.Vector3(0, 0, 0),
                );
            });

        this.nodeSearch.selectFinalPositionFromSearch$
            .pipe(untilDestroyed(this))
            .subscribe((position) => {
                this.uniforms['motionOrigin'] = position;
                this.dispose();
            });

        this.store$
            .select(selectNodeMotionIntensity)
            .pipe(untilDestroyed(this))
            .subscribe((intensity) => {
                const updatedIntensity = intensity / 1000.0;
                this.uniforms['motionIntensity'] = { value: updatedIntensity };
            });

        this.store$
            .select(selectEdgeDepthTest)
            .pipe(untilDestroyed(this))
            .subscribe((depthTest) => {
                this.depthTest = depthTest;
            });

        this.store$
            .select(selectEnableChannelFog)
            .pipe(untilDestroyed(this))
            .subscribe((enableChannelFog) => {
                this.uniforms['fogEnabled'] = { value: enableChannelFog };
            });

        this.store$
            .select(selectFogDistance)
            .pipe(untilDestroyed(this))
            .subscribe((fogDistance) => {
                this.uniforms['fogDistance'] = { value: fogDistance };
            });
    }
}
