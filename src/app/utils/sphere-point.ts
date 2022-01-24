import * as THREE from 'three';
import * as seedRandom from 'seedrandom';

export const createSpherePoint = (
    radius: number,
    position: THREE.Vector3,
    seed: string,
    newPosition: THREE.Vector3,
): void => {
    const rng = seedRandom.xor128(seed);
    const s = 2 * Math.PI * rng();
    const t = 2 * Math.PI * rng();

    const randomnessFactor = 0.2;

    const x = radius * Math.cos(s) * Math.sin(t) + position.x + (rng() - 0.5) * randomnessFactor; //randomness to dissipate spheres
    const y = radius * Math.sin(s) * Math.sin(t) + position.y + (rng() - 0.5) * randomnessFactor;
    const z = radius * Math.cos(t) + position.z + (rng() - 0.5) * randomnessFactor;

    newPosition.set(x, y, z);

    //return new THREE.Vector3(x, y, z);
};
