import * as THREE from 'three';

export const BasicShader = {
    uniforms: {
        size: { value: 1.0 },
        color: { value: new THREE.Color(0xffffff) },
        alphaTest: { value: 0.9 },
    },
    vertexShader: /*glsl*/ `
    // attribute float size;
    uniform float size;
    attribute vec3 customColor;

    varying vec3 vColor;

    void main() {

        vColor = customColor;

        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

        gl_PointSize = size * ( 1000.0 / -mvPosition.z );

        gl_Position = projectionMatrix * mvPosition;

    }`,

    fragmentShader: /*glsl*/ `
    uniform vec3 color;
    uniform sampler2D pointTexture;
    uniform float alphaTest;

    varying vec3 vColor;

    void main() {

        vec4 outColor = texture2D( pointTexture, gl_PointCoord );

        if ( outColor.a < 0.5 ) discard;

        gl_FragColor = outColor * vec4( color * vColor.xyz, 1.0 );

        float depth = gl_FragCoord.z / gl_FragCoord.w;
        const vec3 fogColor = vec3( 0.0 );

        float fogFactor = smoothstep( 200.0, 600.0, depth );
        gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );

    }`,
};
