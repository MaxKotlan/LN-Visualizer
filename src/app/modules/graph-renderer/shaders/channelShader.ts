import * as THREE from 'three';
import { Shader } from 'three';

export const ChannelShader = {
    vertexShader: /*glsl*/ `
    attribute vec3 color;

    varying vec3 vColor;

    void main() {

        vColor = color;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }`,

    fragmentShader: /*glsl*/ `
    varying vec3 vColor;

    void main() {
        gl_FragColor = vec4( vColor, 1.0 );
    }`,
} as Shader;
