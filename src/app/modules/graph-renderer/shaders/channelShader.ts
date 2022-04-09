import { Shader } from 'three';

export const ChannelShader = {
    uniforms: {
        sinTime: { value: 0.0 },
    },
    vertexShader: /*glsl*/ `
    uniform float sinTime;
    attribute vec3 color;

    varying vec3 vColor;

    void main() {

        vColor = color;
        vec3 moveFactor = vec3(position.x, position.y, position.z);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position + .01*sinTime*moveFactor+.5, 1.0 );

    }`,

    fragmentShader: /*glsl*/ `
    varying vec3 vColor;

    void main() {
        gl_FragColor = vec4( vColor, 1.0 );
    }`,
} as Shader;
