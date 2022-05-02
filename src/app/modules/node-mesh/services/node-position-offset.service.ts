import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Vector3 } from 'three';
import { selectNodeMotionIntensity } from '../../controls-renderer/selectors';
import { NodeSearchEffects } from '../../graph-renderer/effects/node-search.effects';
import { AnimationTimeService } from '../../graph-renderer/services/animation-timer/animation-time.service';

@Injectable({
    providedIn: 'root',
})
export class NodePositionOffsetService {
    constructor(
        private nodeSearchEffects: NodeSearchEffects,
        private animationTimeService: AnimationTimeService,
        private store$: Store<any>,
    ) {
        this.handleUpdates();
    }

    private motionOrigin: Vector3 = new Vector3(0, 0, 0);
    private motionIntensity: number = 0.01;

    public applyOffset(vec3: Vector3) {
        const test = vec3.clone();
        const origDist = Math.sqrt(this.motionOrigin.distanceTo(test));
        test.multiplyScalar(origDist).multiplyScalar(this.motionIntensity).multiply(this.timeVec);
        vec3.add(test);
    }

    private timeVec: Vector3 = new Vector3(0, 0, 0);

    private handleUpdates() {
        this.animationTimeService.sinTime$.subscribe((elapsed) => this.setSinTime(elapsed));

        this.animationTimeService.cosTime$.subscribe((elapsed) => this.setCosTime(elapsed));

        this.store$.select(selectNodeMotionIntensity).subscribe((intensity) => {
            const updatedIntensity = intensity / 1000.0;
            this.setMotionIntenstiy(updatedIntensity);
        });

        this.nodeSearchEffects.selectFinalPositionFromSearch$.subscribe((position) => {
            this.setMotionOrigin(position.value);
        });
    }

    public setMotionIntenstiy(intensity: number) {
        this.motionIntensity = intensity;
    }

    public setMotionOrigin(motionOrigin: Vector3) {
        this.motionOrigin = motionOrigin;
    }

    public setSinTime(sin: number) {
        this.timeVec.setX(sin);
    }

    public setCosTime(cos: number) {
        this.timeVec.setY(cos);
        this.timeVec.setZ(cos);
    }
}
