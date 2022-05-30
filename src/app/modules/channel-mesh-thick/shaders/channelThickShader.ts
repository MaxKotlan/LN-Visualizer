import { Shader } from 'three';

export const ChannelThickShader = {
    uniforms: {
        sinTime: { value: 0.0 },
        cosTime: { value: 0.0 },
        motionIntensity: { value: 0.0 },
        fogDistance: { value: 1.0 },
        fogEnabled: { value: true },
    },
    vertexShader: /*glsl*/ `
    #include <common>
    #include <color_pars_vertex>
    #include <fog_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>

    uniform float linewidth;
    uniform vec2 resolution;

    attribute vec3 instanceStart;
    attribute vec3 instanceEnd;

    attribute vec3 instanceColorStart;
    attribute vec3 instanceColorEnd;

    varying vec2 vUv;
    varying vec4 worldPos;
    varying vec3 worldStart;
    varying vec3 worldEnd;

    uniform float sinTime;
    uniform float motionIntensity;
    uniform vec3 motionOrigin;
    uniform vec3 mouseRayOrigin;
    uniform vec3 mouseRayDirection;
    uniform float cosTime;


    #ifdef USE_DASH

        uniform float dashScale;
        attribute float instanceDistanceStart;
        attribute float instanceDistanceEnd;
        varying float vLineDistance;

    #endif

    void trimSegment( const in vec4 start, inout vec4 end ) {

        // trim end segment so it terminates between the camera plane and the near plane

        // conservative estimate of the near plane
        float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
        float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
        float nearEstimate = - 0.5 * b / a;

        float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

        end.xyz = mix( start.xyz, end.xyz, alpha );

    }

    void main() {

        #ifdef USE_COLOR

            vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

        #endif

        #ifdef USE_DASH

            vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;

        #endif

        float aspect = resolution.x / resolution.y;

        vUv = uv;

        vec3 timeVec = vec3(sinTime, cosTime, cosTime );

        vec3 moveFactorStart = instanceStart;
        float distStart = sqrt(distance(instanceStart, motionOrigin));
        vec3 instanceStart = vec3( instanceStart + distStart*motionIntensity*timeVec*moveFactorStart);

        vec3 moveFactorEnd = instanceEnd;
        float distEnd = sqrt(distance(instanceEnd, motionOrigin));
        vec3 instanceEnd = vec3( instanceEnd + distEnd*motionIntensity*timeVec*moveFactorEnd);

        // camera space
        vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
        vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

        worldStart = start.xyz;
        worldEnd = end.xyz;

        // special case for perspective projection, and segments that terminate either in, or behind, the camera plane
        // clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
        // but we need to perform ndc-space calculations in the shader, so we must address this issue directly
        // perhaps there is a more elegant solution -- WestLangley

        bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

        if ( perspective ) {

            if ( start.z < 0.0 && end.z >= 0.0 ) {

                trimSegment( start, end );

            } else if ( end.z < 0.0 && start.z >= 0.0 ) {

                trimSegment( end, start );

            }

        }

        // clip space
        vec4 clipStart = projectionMatrix * start;
        vec4 clipEnd = projectionMatrix * end;

        // ndc space
        vec3 ndcStart = clipStart.xyz / clipStart.w;
        vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

        // direction
        vec2 dir = ndcEnd.xy - ndcStart.xy;

        // account for clip-space aspect ratio
        dir.x *= aspect;
        dir = normalize( dir );



        #ifdef WORLD_UNITS

            // get the offset direction as perpendicular to the view vector
            vec3 worldDir = normalize( end.xyz - start.xyz );
            vec3 offset;

            if ( position.y < 0.5 ) {

                offset = normalize( cross( start.xyz, worldDir ) );

            } else {

                offset = normalize( cross( end.xyz, worldDir ) );

            }

            // sign flip
            if ( position.x < 0.0 ) offset *= - 1.0;

            float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

            // don't extend the line if we're rendering dashes because we
            // won't be rendering the endcaps
            #ifndef USE_DASH

                // extend the line bounds to encompass  endcaps
                start.xyz += - worldDir * linewidth * 0.5;
                end.xyz += worldDir * linewidth * 0.5;

                // shift the position of the quad so it hugs the forward edge of the line
                offset.xy -= dir * forwardOffset;
                offset.z += 0.5;

            #endif

            // endcaps
            if ( position.y > 1.0 || position.y < 0.0 ) {

                offset.xy += dir * 2.0 * forwardOffset;

            }

            // adjust for linewidth
            offset *= linewidth * 0.5;

            // set the world position
            worldPos = ( position.y < 0.5 ) ? start : end;
            worldPos.xyz += offset;

            // project the worldpos
            vec4 clip = projectionMatrix * worldPos;

            // shift the depth of the projected points so the line
            // segements overlap neatly
            vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
            clip.z = clipPose.z * clip.w;

        #else

            vec2 offset = vec2( dir.y, - dir.x );
            // undo aspect ratio adjustment
            dir.x /= aspect;
            offset.x /= aspect;

            // sign flip
            if ( position.x < 0.0 ) offset *= - 1.0;

            // endcaps
            if ( position.y < 0.0 ) {

                offset += - dir;

            } else if ( position.y > 1.0 ) {

                offset += dir;

            }

            // adjust for linewidth
            offset *= linewidth;

            // adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
            offset /= resolution.y;

            // select end
            vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

            // back to clip space
            offset *= clip.w;

            clip.xy += offset;

        #endif

        gl_Position = clip;

        vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

        #include <logdepthbuf_vertex>
        #include <clipping_planes_vertex>
        #include <fog_vertex>

    }
    `,

    fragmentShader: /*glsl*/ `
    varying vec3 vColor;
    varying float cameraDistance;
    precision mediump float;
    uniform highp float fogDistance;
    uniform highp float sinTime;
    uniform bool fogEnabled;

    float dither8x8(vec2 position, float brightness) {
        int x = int(mod(position.x, 8.0));
        int y = int(mod(position.y, 8.0));
        int index = x + y * 8;
        float limit = 0.0;
      
        if (x < 8) {
          if (index == 0) limit = 0.015625;
          if (index == 1) limit = 0.515625;
          if (index == 2) limit = 0.140625;
          if (index == 3) limit = 0.640625;
          if (index == 4) limit = 0.046875;
          if (index == 5) limit = 0.546875;
          if (index == 6) limit = 0.171875;
          if (index == 7) limit = 0.671875;
          if (index == 8) limit = 0.765625;
          if (index == 9) limit = 0.265625;
          if (index == 10) limit = 0.890625;
          if (index == 11) limit = 0.390625;
          if (index == 12) limit = 0.796875;
          if (index == 13) limit = 0.296875;
          if (index == 14) limit = 0.921875;
          if (index == 15) limit = 0.421875;
          if (index == 16) limit = 0.203125;
          if (index == 17) limit = 0.703125;
          if (index == 18) limit = 0.078125;
          if (index == 19) limit = 0.578125;
          if (index == 20) limit = 0.234375;
          if (index == 21) limit = 0.734375;
          if (index == 22) limit = 0.109375;
          if (index == 23) limit = 0.609375;
          if (index == 24) limit = 0.953125;
          if (index == 25) limit = 0.453125;
          if (index == 26) limit = 0.828125;
          if (index == 27) limit = 0.328125;
          if (index == 28) limit = 0.984375;
          if (index == 29) limit = 0.484375;
          if (index == 30) limit = 0.859375;
          if (index == 31) limit = 0.359375;
          if (index == 32) limit = 0.0625;
          if (index == 33) limit = 0.5625;
          if (index == 34) limit = 0.1875;
          if (index == 35) limit = 0.6875;
          if (index == 36) limit = 0.03125;
          if (index == 37) limit = 0.53125;
          if (index == 38) limit = 0.15625;
          if (index == 39) limit = 0.65625;
          if (index == 40) limit = 0.8125;
          if (index == 41) limit = 0.3125;
          if (index == 42) limit = 0.9375;
          if (index == 43) limit = 0.4375;
          if (index == 44) limit = 0.78125;
          if (index == 45) limit = 0.28125;
          if (index == 46) limit = 0.90625;
          if (index == 47) limit = 0.40625;
          if (index == 48) limit = 0.25;
          if (index == 49) limit = 0.75;
          if (index == 50) limit = 0.125;
          if (index == 51) limit = 0.625;
          if (index == 52) limit = 0.21875;
          if (index == 53) limit = 0.71875;
          if (index == 54) limit = 0.09375;
          if (index == 55) limit = 0.59375;
          if (index == 56) limit = 1.0;
          if (index == 57) limit = 0.5;
          if (index == 58) limit = 0.875;
          if (index == 59) limit = 0.375;
          if (index == 60) limit = 0.96875;
          if (index == 61) limit = 0.46875;
          if (index == 62) limit = 0.84375;
          if (index == 63) limit = 0.34375;
        }
        return brightness < limit ? 0.0 : 1.0;
    }

    void main() {
        float b = log(fogDistance+1.) / log(cameraDistance+1.);
        float c = fogEnabled ? min(b, 1.0) : 1.0;
        // float r = dither8x8(gl_FragCoord.xy*1.0, c);
        vec3 fogColor = vec3(.1,.1,.1);
        gl_FragColor = vec4( vColor*c,1.0);
        if ( gl_FragColor.a < .1 ) discard;
    }`,
} as Shader;
