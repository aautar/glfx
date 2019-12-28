precision mediump float;

uniform float uPeriod;
uniform float uSceneWidth;
uniform float uSceneHeight;
uniform sampler2D uSampler;		  
varying vec2 vTextureCoord;

void main(void) {

    vec4 shiftedSampleLeft = vec4( 0. );
    vec4 shiftedSampleRight = vec4( 0. );

    float blurSampleOffsetScale = 2.1;
    float px = (1.0 / uSceneWidth) * blurSampleOffsetScale;
    float py = (1.0 / uSceneHeight) * blurSampleOffsetScale;
    // need depth info

    vec4 src = texture2D( uSampler, ( vTextureCoord ) );

    shiftedSampleLeft = texture2D( uSampler, ( vTextureCoord + vec2(-0.00525, 0) ) );
    shiftedSampleRight = texture2D( uSampler, ( vTextureCoord + vec2(0.00525, 0) ) );

    gl_FragColor = src * vec4(1, shiftedSampleLeft.g, 1, 1) * vec4(shiftedSampleRight.r, 1, 1, 1);

}