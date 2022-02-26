import * as THREE from 'three';
import { Shader } from 'three';

export const BasicShader = {
    uniforms: {
        size: { value: 3.0 },
        color: { value: new THREE.Color(0xffffff) },
        alphaTest: { value: 0.5 },
        renderIcon: { value: true },
        pointAttenuation: { value: true },
    },
    vertexShader: /*glsl*/ `
    // attribute float size;
    uniform float size;
    uniform bool renderIcon;
    uniform bool pointAttenuation;
    attribute vec3 nodeColor;
    attribute float averageCapacityRatio;

    varying vec3 vColor;

    void main() {

        vColor = nodeColor;

        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

        gl_PointSize = size * averageCapacityRatio *  ( 500.0 / (pointAttenuation ? -mvPosition.z : 1.0 ) );

        gl_Position = projectionMatrix * mvPosition;

    }`,

    fragmentShader: /*glsl*/ `
    uniform vec3 color;
    uniform sampler2D pointTexture;
    uniform float alphaTest;
    uniform bool renderIcon;
    varying vec3 vColor;

    void main() {

        gl_FragColor = vec4( color * vColor, 1.0 );

        vec4 txcord = renderIcon? texture2D( pointTexture, gl_PointCoord ) : gl_FragColor;

        // if (txcord.r == 1.0 && 
        //     txcord.g == 1.0 && 
        //     txcord.b == 1.0) {
        //     gl_FragColor = mix(vec4(1.0,1.0,1.0,1.0), gl_FragColor, .5);
        // } else {
        //     gl_FragColor = gl_FragColor * txcord;
        // }
        gl_FragColor = gl_FragColor * txcord;
        if ( gl_FragColor.a < alphaTest ) discard;

    }`,
} as Shader;
