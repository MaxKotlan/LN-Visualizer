import { Shader } from 'three';

export const ChannelShader = {
    uniforms: {
        sinTime: { value: 0.0 },
        cosTime: { value: 0.0 },
        motionIntensity: { value: 0.0 },
    },
    vertexShader: /*glsl*/ `
    uniform float sinTime;
    uniform float motionIntensity;
    attribute vec3 color;
    uniform vec3 motionOrigin;
    uniform vec3 mouseRayOrigin;
    uniform vec3 mouseRayDirection;
    uniform float cosTime;

    varying vec3 vColor;

    // float rand(vec2 st) {
    //     return fract(sin(dot(st.xy,
    //                          vec2(12.9898,78.233)))*
    //         43758.5453123);
    // }

    float dline( vec2 p, vec2 a, vec2 b ) {
        
        vec2 v = a, w = b;
        
        // float l2 = pow(distance(w, v), 2.);
        // if(l2 == 0.0) return distance(p, v);
        
        float t = clamp(dot(p - v, w - v), 0., 1.);
        vec2 j = v + t * (w - v);
        
        return distance(p, j);
        
    }
    

    float minDistanceToLine(vec3 pointA, vec3 lineOrigin, vec3 lineDirection ){
        vec3 sVec = lineOrigin - pointA;
        float tSum = lineDirection.x * lineDirection.x + lineDirection.y * lineDirection.y + lineDirection.z * lineDirection.z;
        float sSum =  lineDirection.x * sVec.x + lineDirection.y * sVec.y + lineDirection.z * sVec.z;
        float slope = -sSum / tSum;
        vec3 qVec = sVec + (slope * lineDirection);
        return length(qVec);
    }

    void main() {
        vColor = color;
        float lnDist = 1.0;//minDistanceToLine( position, mouseRayOrigin, mouseRayDirection );// );
        vec3 moveFactor = position;
        vec3 timeVec = vec3(sinTime, cosTime, cosTime );
        float dist = sqrt(distance(position, motionOrigin));
        //float rnd = rand( vec2( position.x, position.z ) )-.5;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position + lnDist*dist*motionIntensity*timeVec*moveFactor, 1.0 );

    }`,

    fragmentShader: /*glsl*/ `
    varying vec3 vColor;

    void main() {
        gl_FragColor = vec4( vColor, 1.0 );
    }`,
} as Shader;
