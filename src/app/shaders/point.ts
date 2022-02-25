import * as THREE from 'three';

export const BasicShader = {
    uniforms: {
        size: { value: 10.0 },
        color: { value: new THREE.Color(0xffffff) },
    },
    vertexShader: /*glsl*/ `
    // attribute float size;
    uniform float size;
    attribute vec3 customColor;

    varying vec3 vColor;

    void main() {

        vColor = customColor;

        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

        gl_PointSize = size * ( 300.0 / -mvPosition.z );

        gl_Position = projectionMatrix * mvPosition;

    }`,

    fragmentShader: /*glsl*/ `
    uniform vec3 color;
    uniform sampler2D pointTexture;
    uniform float alphaTest;

    varying vec3 vColor;

    void main() {

        gl_FragColor = vec4( color * vColor, 1.0 );

        gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

        if ( gl_FragColor.a < alphaTest ) discard;

    }`,
};
