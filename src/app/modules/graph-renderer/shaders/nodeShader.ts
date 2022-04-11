import * as THREE from 'three';
import { Shader } from 'three';

export const NodeShader = {
    uniforms: {
        size: { value: 3.0 },
        color: { value: new THREE.Color(0xffffff) },
        alphaTest: { value: 0.5 },
        renderIcon: { value: true },
        pointAttenuation: { value: true },
        minimumSize: { value: 0.01 },
        uniformSize: { value: false },
        sinTime: { value: 0.0 },
        motionIntensity: { value: 0.0 },
    },
    vertexShader: /*glsl*/ `
    // attribute float size;
    uniform float size;
    uniform bool renderIcon;
    uniform bool pointAttenuation;
    uniform float minimumSize;
    uniform float sinTime;
    uniform bool uniformSize;
    attribute vec3 nodeColor;
    attribute float averageCapacityRatio;
    uniform float motionIntensity;
    uniform vec3 motionOrigin;
    uniform vec3 mouseRayOrigin;
    uniform vec3 mouseRayDirection;

    varying vec3 vColor;

    float rand(vec2 st) {
        return fract(sin(dot(st.xy,
                             vec2(12.9898,78.233)))*
            43758.5453123);
    }

    float distanceToLine(vec3 pointA, vec3 lineOrigin, vec3 lineDirection ){
        float tSum = lineDirection.x * lineDirection.x + lineDirection.y * lineDirection.y + lineDirection.z * lineDirection.z;
        vec3 sVec = lineDirection - pointA;
        float sSum =  lineDirection.x * sVec.x + lineDirection.y * sVec.y + lineDirection.z * sVec.z;
        float slope = -sSum / tSum;
        vec3 qVec = slope * lineDirection + sVec;
        return sqrt( qVec.x*qVec.x + qVec.y*qVec.y + qVec.z*qVec.z );
    }

    void main() {

        vColor = nodeColor;

        float lnDist = distanceToLine(position, mouseRayOrigin, mouseRayDirection);
        float invertedCap = (1.-averageCapacityRatio);
        vec3 moveFactor = position;// motionOrigin;//vec3(position.x, position.y, position.z);
        float dist = sqrt(distance(position, motionOrigin));
        float rnd = rand( vec2( position.x, position.z ) )-.5;

        vec4 mvPosition = modelViewMatrix * vec4( position + lnDist*dist*motionIntensity*sinTime/**invertedCap*/*moveFactor*rnd+.5, 1.0 );

        gl_PointSize = (size * (uniformSize ? 1. : averageCapacityRatio) + minimumSize) *  ( 500.0 / (pointAttenuation ? -mvPosition.z : 500.0 ) );

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
