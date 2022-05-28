import { Component, Optional, SkipSelf } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import * as THREE from 'three';
import { ChannelThickGeometry } from '../geometry';
import { ChannelThickMaterial } from '../material';

@UntilDestroy()
@Component({
    selector: 'app-channel-object',
    providers: [provideParent(SphereMeshComponent)],
    template: '<ng-content></ng-content>',
})
export class ChannelThickObjectComponent extends AbstractObject3D<THREE.LineSegments> {
    constructor(
        protected override rendererService: RendererService,
        private geometry: ChannelThickGeometry,
        private material: ChannelThickMaterial,
        @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
    ) {
        super(rendererService, parent);
    }

    protected newObject3DInstance(): THREE.LineSegments {
        const line = new THREE.LineSegments(this.geometry, this.material);
        line.renderOrder = -1;
        return line;
    }
}
