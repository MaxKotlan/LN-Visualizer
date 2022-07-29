import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
    providedIn: 'root',
})
export class TestMaterial extends THREE.PointsMaterial {
    constructor() {
        super({ size: 1, sizeAttenuation: true, alphaTest: 0.5, transparent: true });
    }
}
