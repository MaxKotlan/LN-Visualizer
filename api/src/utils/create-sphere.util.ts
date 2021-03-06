import * as THREE from 'three';
import * as seedRandom from 'seedrandom';

export const createSpherePoint = (
    radius: number,
    position: THREE.Vector3,
    seed: string,
    newPosition: THREE.Vector3,
): void => {
    const rng = seedRandom.xor128(seed);
    const s = 2 * Math.PI * (rng() - 0.5);
    const t = 2 * Math.PI * (rng() - 0.5);

    const randomnessFactor = 0.2;

    const x = radius * Math.cos(s) * Math.sin(t) + position.x + (rng() - 0.5) * randomnessFactor;
    const y = radius * Math.sin(s) * Math.sin(t) + position.y + (rng() - 0.5) * randomnessFactor;
    const z = radius * Math.cos(t) + position.z + (rng() - 0.5) * randomnessFactor;

    newPosition.set(x, y, z);
};
