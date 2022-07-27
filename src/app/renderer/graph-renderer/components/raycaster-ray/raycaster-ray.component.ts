import { Component, Optional, SkipSelf } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { AbstractObject3D, provideParent, RendererService, SphereMeshComponent } from 'atft';
import { setMouseRay } from 'src/app/ui/controls-renderer/actions';
import * as THREE from 'three';
import { BufferAttribute, Ray, Vector3 } from 'three';

@Component({
    selector: 'app-raycaster-ray',
    providers: [provideParent(SphereMeshComponent)],
    template: '<ng-content></ng-content>',
})
export class RaycasterRayComponent extends AbstractObject3D<THREE.LineSegments> {
    constructor(
        protected override rendererService: RendererService,
        private actions: Actions,
        @SkipSelf() @Optional() protected override parent: AbstractObject3D<any>,
    ) {
        super(rendererService, parent);
        this.actions.pipe(ofType(setMouseRay)).subscribe((ray) => {
            this.ray = ray.value;
            this.object.geometry = this.newObject3DInstance().geometry;
        });
    }

    public ray: Ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 1, 0));

    protected newObject3DInstance(): any {
        let material = new THREE.LineBasicMaterial({
            color: 0xff0000,
            linewidth: 10,
        });
        let geometry = new THREE.BufferGeometry();
        let vertices: Float32Array = new Float32Array(9);
        let startVec = new THREE.Vector3(this.ray.origin.x, this.ray.origin.y, this.ray.origin.z);

        let endVec = new THREE.Vector3(
            this.ray.direction.x,
            this.ray.direction.y,
            this.ray.direction.z,
        );

        // could be any number
        endVec.multiplyScalar(5000);

        // get the point in the middle
        let midVec = new THREE.Vector3();
        midVec.lerpVectors(startVec, endVec, 0.5);

        vertices[0] = startVec.x;
        vertices[1] = startVec.y;
        vertices[2] = startVec.z;

        vertices[3] = midVec.x;
        vertices[4] = midVec.y;
        vertices[5] = midVec.z;

        vertices[6] = endVec.x;
        vertices[7] = endVec.y;
        vertices[8] = endVec.z;

        geometry.setAttribute('position', new BufferAttribute(vertices, 3));
        geometry.attributes['position'].needsUpdate = true;
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();

        // geometry['vertices'].push(startVec);
        // geometry['vertices'].push(midVec);
        // geometry['vertices'].push(endVec);

        // console.log('vec start', startVec);
        // console.log('vec mid', midVec);
        // console.log('vec end', endVec);

        let line = new THREE.Line(geometry, material);
        return line;
    }
}
