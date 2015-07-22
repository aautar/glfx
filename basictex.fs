precision mediump float;

uniform sampler2D uSampler;		  
varying vec2 vTextureCoord;

void main(void) {
  gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
}