import { Shader } from 'three';

export const ChannelShader = {
    uniforms: {
        sinTime: { value: 0.0 },
        motionIntensity: { value: 0.0 },
    },
    vertexShader: /*glsl*/ `
    uniform float sinTime;
    uniform float motionIntensity;
    attribute vec3 color;

    varying vec3 vColor;

    float rand(vec2 st) {
        return fract(sin(dot(st.xy,
                             vec2(12.9898,78.233)))*
            43758.5453123);
    }

    void main() {

        vColor = color;
        vec3 moveFactor = vec3(position.x, position.y, position.z);
        float rnd = rand( vec2( position.x, position.z ) )-.5;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position + motionIntensity*sinTime*moveFactor*rnd+.5, 1.0 );

    }`,

    fragmentShader: /*glsl*/ `
    varying vec3 vColor;

    void main() {
        gl_FragColor = vec4( vColor, 1.0 );
    }`,
} as Shader;
