import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as THREE from 'three';
import { Uniform } from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import {
    selectChannelWidth,
    selectEdgeDepthTest,
    selectEnableChannelFog,
    selectFogDistance,
    selectLineAttenuation,
} from '../../controls-channel/selectors';
import { setMouseRay } from '../../controls-renderer/actions';
import { selectNodeMotionIntensity } from '../../controls-renderer/selectors';
import { NodeSearchEffects } from '../../graph-renderer/effects/node-search.effects';
import { GraphState } from '../../graph-renderer/reducer';
import { AnimationTimeService } from '../../graph-renderer/services/animation-timer/animation-time.service';
import { ChannelThickShader } from '../shaders/channelThickShader';

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
            linewidth: 0.03, // in world units with size attenuation, pixels otherwise
            vertexColors: true,
            worldUnits: true,
            //resolution:  // to be set by renderer, eventually
            dashed: true,
            alphaToCoverage: true,
            fog: true,
        });
        this.vertexShader = ChannelThickShader.vertexShader;
        console.log(this);
        this.handleUpdates();
    }

    worldUns: boolean = true;

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
            this.dispose();
        });

        this.store$.select(selectNodeMotionIntensity).subscribe((intensity) => {
            const updatedIntensity = intensity / 1000.0;
            this.uniforms['motionIntensity'] = { value: updatedIntensity };
        });

        this.store$.select(selectEdgeDepthTest).subscribe((depthTest) => {
            this.depthTest = depthTest;
        });

        this.store$.select(selectEnableChannelFog).subscribe((enableChannelFog) => {
            this.uniforms['fogEnabled'] = { value: enableChannelFog };
        });

        this.store$.select(selectFogDistance).subscribe((fogDistance) => {
            this.uniforms['fogDistance'] = { value: fogDistance };
        });

        this.store$.select(selectChannelWidth).subscribe((width) => {
            this.linewidth = width;
        });

        this.store$.select(selectLineAttenuation).subscribe((worldUnits) => {
            console.log(this.uniforms);
            this.worldUnits = worldUnits;
            this.needsUpdate = true;
        });
    }
}
