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
        cosTime: { value: 0.0 },
        motionIntensity: { value: 0.0 },
    },
    vertexShader: /*glsl*/ `
    // attribute float size;
    uniform float size;
    uniform bool renderIcon;
    uniform bool pointAttenuation;
    uniform float minimumSize;
    uniform float sinTime;
    uniform float cosTime;
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

    float dline( vec2 p, vec2 a, vec2 b ) {
    
        //vec2 mx = mix(a, b, clamp( map(p.x, a.x, b.x, 0., 1.), 0., 1. ) );
        //vec2 my = mix(a, b, clamp( map(p.y, a.y, b.y, 0., 1.), 0., 1. ) );
        
        //return min(distance(mx, p),distance(my, p));
        
        
        //v2
        //float den = distance(a, b);
        //float num = abs( (b.y-a.y)*p.x - (b.x-a.x)*p.y + b.x*a.y - b.y*a.x );
        
        //float d = num / den;
        
        //return d;
        
        //v3
        
        /*
    https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
    float minimum_distance(vec2 v, vec2 w, vec2 p) {
      // Return minimum distance between line segment vw and point p
      const float l2 = length_squared(v, w);  // i.e. |w-v|^2 -  avoid a sqrt
      if (l2 == 0.0) return distance(p, v);   // v == w case
      // Consider the line extending the segment, parameterized as v + t (w - v).
      // We find projection of point p onto the line. 
      // It falls where t = [(p-v) . (w-v)] / |w-v|^2
      // We clamp t from [0,1] to handle points outside the segment vw.
      const float t = max(0, min(1, dot(p - v, w - v) / l2));
      const vec2 projection = v + t * (w - v);  // Projection falls on the segment
      return distance(p, projection);
    }
    
        */
        
        vec2 v = a, w = b;
        
        float l2 = pow(distance(w, v), 2.);
        if(l2 == 0.0) return distance(p, v);
        
        float t = clamp(dot(p - v, w - v) / l2, 0., 1.);
        vec2 j = v + t * (w - v);
        
        return distance(p, j);
        
    }

    float lineDistSin(vec3 uv, vec3 lineDir, vec3 linePoint) {
        float len = length(uv - linePoint);
        float c = clamp(dot(lineDir, uv - linePoint) / len, -1.0, 1.0);
        return sqrt(1.0 - c*c) * len;
    }
    

    // float distanceFromPointToLine(in vec3 a, in vec3 b, in vec3 c) {
    //     vec3 ba = a - b;
    //     vec3 bc = c - b;
    //     float d = dot(ba, bc);
    //     float len = length(bc);
    //     float param = 0.0;
    //     if (len != 0.0) {
    //       param = clamp(d / (len * len), 0.0, 1.0);
    //     }
    //     vec3 r = b + bc * param;
    //     return distance(a, r);
    //   }

    // float minDistanceToLine(vec3 pointA, vec3 lineOrigin, vec3 lineDirection ){
    //     vec3 sVec = lineOrigin - pointA;
    //     float tSum = lineDirection.x * lineDirection.x + lineDirection.y * lineDirection.y + lineDirection.z * lineDirection.z;
    //     float sSum = lineDirection.x * sVec.x + lineDirection.y * sVec.y + lineDirection.z * sVec.z;
    //     float slope = -sSum / tSum;
    //     vec3 qVec = sVec + vec3(lineDirection.x*slope, lineDirection.y*slope, lineDirection.z*slope);
    //     //return length(sVec);
    //     return length(qVec);
    // }


    
    void main() {

        vColor = nodeColor;

        float lnDist = 1.0;//sqrt(sin(dline( position, mouseRayOrigin, mouseRayDirection )));// );
        float invertedCap = (1.-averageCapacityRatio);
        vec3 moveFactor = position;// motionOrigin;//vec3(position.x, position.y, position.z);
        float dist = sqrt(distance(position, motionOrigin));
        float rnd = rand( vec2( position.x, position.z ) )-.5;

        vec3 timeVec = vec3(sinTime, cosTime, cosTime );

        vec3 newPos = lnDist*dist*motionIntensity*timeVec/**invertedCap*/*moveFactor*rnd+.5;
        // float crazy = minDistanceToLine( newPos, mouseRayOrigin, mouseRayDirection );

        vec4 mvPosition = modelViewMatrix * vec4( position + newPos, 1.0 );

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
