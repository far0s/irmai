// heavily copied/inspired by the "Noise & Texture" plugin in Figma
// which allows to generate noise textures with a lot of control
// this one is based on the "Aura" preset

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color;
uniform vec4 u_background;
uniform float u_speed;
uniform float u_detail;
uniform float u_scale;
uniform float u_distance;
varying vec2 vUv;

/*
* @author Hazsi (kinda)
*/
mat2 m(float a) {
  float c=cos(a), s=sin(a);
  return mat2(c,-s,s,c);
}

float map(vec3 p) {
  float t = u_time * u_speed;
  p.xz *= m(t * 0.4);p.xy*= m(t * 0.1);
  vec3 q = p * 2.0 + t;
  return length(p+vec3(sin((t*u_speed) * 0.1))) * log(length(p) + 0.9) + cos(q.x + sin(q.z + cos(q.y))) * 0.5 - 1.0;
}

void main() {
  // FIXME: the offset is not consistent with the resolution
  vec2 a = gl_FragCoord.xy / u_resolution.xy - vec2(1.0, 2.0);
  vec3 cl = vec3(0.0);
  float d = u_distance;

  for (float i = 0.; i <= (1. + 20. * u_detail); i++) {
    vec3 p = vec3(0, 0, 4.0) + normalize(vec3(a, -u_scale)) * d;
    float rz = map(p);
    float f =  clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);
    vec3 l = vec3(0.1, 0.3, 0.4) + vec3(5.0, 2.5, 3.0) * f;
    cl = cl * l + smoothstep(2.5, 0.0, rz) * 1.0 * l;
    d += min(rz, 1.0);
  }

  vec4 color = vec4(min(u_color, cl), 1.0);
  color.r = max(u_background.r,color.r);
  color.g = max(u_background.g,color.g);
  color.b = max(u_background.b,color.b);
  gl_FragColor = color;
}