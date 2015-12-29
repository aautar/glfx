precision mediump float;

uniform float uPeriod;
uniform sampler2D uSampler;		  
varying vec2 vTextureCoord;

void main(void) {

    vec4 sum = vec4( 0. );
    float px = (1.0 / 800.0) * 2.5;

    vec4 src = texture2D( uSampler, ( vTextureCoord ) );

    sum += texture2D( uSampler, ( vTextureCoord + vec2(-px, 0) ) );
    sum += texture2D( uSampler, ( vTextureCoord + vec2(-px, -px) ) );
    sum += texture2D( uSampler, ( vTextureCoord + vec2(0, -px) ) );
    sum += texture2D( uSampler, ( vTextureCoord + vec2(px, -px) ) );
    sum += texture2D( uSampler, ( vTextureCoord + vec2(px, 0) ) );
    sum += texture2D( uSampler, ( vTextureCoord + vec2(px, px) ) );
    sum += texture2D( uSampler, ( vTextureCoord + vec2(0, px) ) );
    sum += texture2D( uSampler, ( vTextureCoord + vec2(-px, px) ) );
    sum += src;

    sum = sum / 9.0;

    gl_FragColor = src + (sum * 2.5 * uPeriod);

}