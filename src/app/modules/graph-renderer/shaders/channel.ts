import * as THREE from 'three';
import { Shader } from 'three';

export const ChannelShader = {
    uniforms: {
        // amplitude: { value: 0.0 },
        color: { value: new THREE.Color(0xffffff) },
    },
    vertexShader: /*glsl*/ `
    // uniform float amplitude;

    // attribute vec3 displacement;
    attribute vec3 customColor;

    varying vec3 vColor;

    void main() {

        vec3 newPosition = position;

        vColor = customColor;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
    }`,
    fragmentShader: /*glsl*/ `
    uniform vec3 color;

    varying vec3 vColor;

    void main() {
        gl_FragColor = vec4( vColor, 1.0 );
    }
    `,
} as Shader;
