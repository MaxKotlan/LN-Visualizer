import { Component, Optional, SkipSelf } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2';
import { ChannelThickGeometry } from '../geometry';
import { ChannelThickMaterial } from '../material';

@UntilDestroy()
@Component({
    selector: 'app-channel-thick-object',
    providers: [provideParent(SphereMeshComponent)],
    template: '<ng-content></ng-content>',
})
export class ChannelThickObjectComponent extends AbstractObject3D<LineSegments2> {
    constructor(
        protected override rendererService: RendererService,
        private geometry: ChannelThickGeometry,
        private material: ChannelThickMaterial,
        @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
    ) {
        super(rendererService, parent);
    }

    protected newObject3DInstance(): LineSegments2 {
        const line = new LineSegments2(this.geometry, this.material);
        console.log(line);
        line.renderOrder = -1;
        return line;
    }
}
