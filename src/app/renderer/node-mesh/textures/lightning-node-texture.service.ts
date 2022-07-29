import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
    providedIn: 'root',
})
export class NodeTextures {
    protected registry: Record<string, THREE.Texture> = {
        lightningIcon: new THREE.TextureLoader().load('assets/Lightning_Network_dark.svg'),
    };

    constructor() {
        this.registry.lightningIcon.flipY = false;
    }

    getTexture(textureName: string) {
        return this.registry[textureName];
    }
}
