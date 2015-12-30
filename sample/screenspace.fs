precision mediump float;

uniform float uPeriod;
uniform float uSceneWidth;
uniform float uSceneHeight;
uniform sampler2D uSampler;		  
varying vec2 vTextureCoord;

void main(void) {

    vec4 sum = vec4( 0. );
    float blurSampleOffsetScale = 2.8;
    float px = (1.0 / uSceneWidth) * blurSampleOffsetScale;
    float py = (1.0 / uSceneHeight) * blurSampleOffsetScale;

    vec4 src = texture2D( uSampler, ( vTextureCoord ) );

    sum += texture2D( uSampler, ( vTextureCoord + vec2(-px, 0) ) );
    sum += texture2D( uSampler, ( vTextureCoord + vec2(-px, -py) ) );
    sum += texture2D( uSampler, ( vTextureCoord + vec2(0, -py) ) );
    sum += texture2D( uSampler, ( vTextureCoord + vec2(px, -py) ) );
    sum += texture2D( uSampler, ( vTextureCoord + vec2(px, 0) ) );
    sum += texture2D( uSampler, ( vTextureCoord + vec2(px, py) ) );
    sum += texture2D( uSampler, ( vTextureCoord + vec2(0, py) ) );
    sum += texture2D( uSampler, ( vTextureCoord + vec2(-px, py) ) );
    sum += src;

    sum = sum / 9.0;

    gl_FragColor =  src + (sum * 2.5 * uPeriod);

}