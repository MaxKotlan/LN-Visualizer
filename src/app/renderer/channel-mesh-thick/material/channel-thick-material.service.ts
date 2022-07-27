import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as THREE from 'three';
import { Uniform } from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import {
    selectChannelWidthForShader,
    selectChannelWidthIsUniform,
    selectEdgeDepthTest,
    selectEnableChannelFog,
    selectFogDistance,
    selectLineAttenuation,
} from 'src/app/modules/controls-channel/selectors';
import { setMouseRay } from 'src/app/modules/controls-renderer/actions';
import { selectNodeMotionIntensity } from 'src/app/modules/controls-renderer/selectors';
import { NodeSearchEffects } from 'src/app/renderer/graph-renderer/effects/node-search.effects';
import { GraphState } from 'src/app/renderer/graph-renderer/reducer';
import { AnimationTimeService } from 'src/app/renderer/graph-renderer/services/animation-timer/animation-time.service';
import { ChannelThickShader } from '../shaders/channelThickShader';

@UntilDestroy()
@Injectable({
    providedIn: 'root',
})
export class ChannelThickMaterial extends LineMaterial {
    constructor(
        private animationTimeService: AnimationTimeService,
        private actions: Actions,
        private store$: Store<GraphState>,
        private nodeSearch: NodeSearchEffects,
    ) {
        super({
            color: 0xffffff,
            linewidth: 1.0, // in world units with size attenuation, pixels otherwise
            vertexColors: true,
            worldUnits: true,
            //resolution:  // to be set by renderer, eventually
            dashed: true,
            alphaToCoverage: true,
            fog: true,
        });
        this.vertexShader = ChannelThickShader.vertexShader;
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

        this.store$
            .select(selectChannelWidthForShader)
            .pipe(untilDestroyed(this))
            .subscribe((width) => {
                this.linewidth = width;
            });

        this.store$
            .select(selectLineAttenuation)
            .pipe(untilDestroyed(this))
            .subscribe((worldUnits) => {
                this.worldUnits = worldUnits;
                this.needsUpdate = true;
            });

        this.store$
            .select(selectChannelWidthIsUniform)
            .pipe(untilDestroyed(this))
            .subscribe((isUniform) => {
                this.uniforms['isUniform'] = { value: isUniform };
                this.needsUpdate = true;
            });
    }
}
