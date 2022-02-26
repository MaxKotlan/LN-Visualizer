import * as THREE from 'three';

export const BasicShader = {
    uniforms: {
        size: { value: 3.0 },
        color: { value: new THREE.Color(0xffffff) },
        alphaTest: { value: 0.5 },
    },
    vertexShader: /*glsl*/ `
    // attribute float size;
    uniform float size;
    attribute vec3 customColor;

    varying vec3 vColor;

    void main() {

        vColor = customColor;

        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

        gl_PointSize = size * ( 500.0 / -mvPosition.z );

        gl_Position = projectionMatrix * mvPosition;

    }`,

    fragmentShader: /*glsl*/ `
    uniform vec3 color;
    uniform sampler2D pointTexture;
    uniform float alphaTest;

    varying vec3 vColor;

    void main() {

        gl_FragColor = vec4( color * vColor, 1.0 );

        vec4 txcord = texture2D( pointTexture, gl_PointCoord );

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
};
