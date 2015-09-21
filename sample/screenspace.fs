precision mediump float;

uniform sampler2D uSampler;		  
varying vec2 vTextureCoord;

void main(void) {


    vec4 sum = vec4( 0. );
    vec2 inc = vec2(0.002);

    sum += texture2D( uSampler, ( vTextureCoord - inc * 4. ) ) * 0.051;
    sum += texture2D( uSampler, ( vTextureCoord - inc * 3. ) ) * 0.0918;
    sum += texture2D( uSampler, ( vTextureCoord - inc * 2. ) ) * 0.12245;
    sum += texture2D( uSampler, ( vTextureCoord - inc * 1. ) ) * 0.1531;
    sum += texture2D( uSampler, ( vTextureCoord + inc * 0. ) ) * 0.1633;
    sum += texture2D( uSampler, ( vTextureCoord + inc * 1. ) ) * 0.1531;
    sum += texture2D( uSampler, ( vTextureCoord + inc * 2. ) ) * 0.12245;
    sum += texture2D( uSampler, ( vTextureCoord + inc * 3. ) ) * 0.0918;
    sum += texture2D( uSampler, ( vTextureCoord + inc * 4. ) ) * 0.051;

    gl_FragColor = sum;

}