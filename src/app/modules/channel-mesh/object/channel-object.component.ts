import { Component, Optional, SkipSelf } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import * as THREE from 'three';
import { ChannelGeometry } from '../geometry';
import { ChannelMaterial } from '../material/channel-material.service';

@UntilDestroy()
@Component({
    selector: 'app-channel-object',
    providers: [provideParent(SphereMeshComponent)],
    template: '<ng-content></ng-content>',
})
export class ChannelObjectComponent extends AbstractObject3D<THREE.LineSegments> {
    constructor(
        protected override rendererService: RendererService,
        private geometry: ChannelGeometry,
        private material: ChannelMaterial,
        @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
    ) {
        super(rendererService, parent);
    }

    protected newObject3DInstance(): THREE.LineSegments {
        return new THREE.LineSegments(this.geometry, this.material);
    }
}
