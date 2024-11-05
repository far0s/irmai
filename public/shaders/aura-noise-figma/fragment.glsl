// heavily copied/inspired by the "Noise & Texture" plugin in Figma
// which allows to generate noise textures with a lot of control
// this one is based on the "Aura" preset

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_startColor;
uniform vec3 u_midColor;
uniform vec3 u_endColor;
uniform vec4 u_background;
uniform float u_speed;
uniform float u_detail;
uniform float u_scale;
uniform float u_distance;
uniform float u_bloom;
uniform float u_center_size;
uniform float u_complexity;
uniform float u_audioLevels[20];
uniform float u_randomSeed;
varying vec2 vUv;

/*
* @author Hazsi (kinda)
*/
mat2 m(float a) {
  float c=cos(a), s=sin(a);
  return mat2(c,-s,s,c);
}

float map(vec3 p) {
  float t = u_time * u_speed + u_randomSeed;
  p.xz *= m(t * 0.4);
  p.xy *= m(t * 0.1);
  vec3 q = p * u_complexity + t;
  return length(p + vec3(sin((t * 0.6) * 0.1))) * log(length(p) + 0.9) + cos(q.x + sin(q.z + cos(q.y))) * 0.5 - u_distance;
}

void mainImage ( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 a = (fragCoord.xy - u_resolution.xy) / min(u_resolution.y, u_resolution.x) * -3.0 * u_scale;
  vec3 cl = vec3(0.0);
  float d = 2.5;

  for (float i = 0.; i <= (1. + 20. * u_detail); i++) {
    vec3 p = vec3(0, 0, 4.0) + normalize(vec3(a, -1.0)) * d;
    float rz = map(p);
    float f =  clamp((rz - map(p + 0.1)) * 0.5, -0.1, 0.1);
    vec3 startColor = u_startColor;
    vec3 midColor = u_midColor * 5.0;
    vec3 endColor = u_endColor * 7.5;
    vec3 l = startColor + midColor * f * 1.0 + endColor * f * 2.0;
    float audioBoost = u_audioLevels[int(20. * u_detail - i)] / 100.0;
    float clamped_center_size = u_center_size >= u_bloom ? u_bloom - 0.1 : u_center_size;
    cl = cl * l + smoothstep(u_bloom + audioBoost , clamped_center_size, rz) * 1.0 * l;
    d += min(rz, 1.0);
  }

  vec4 color = vec4(min(vec3(1.0, 1.0, 1.0), cl), 1.0);
  color.r = max(u_background.r,color.r);
  color.g = max(u_background.g,color.g);
  color.b = max(u_background.b,color.b);
  fragColor = color;
}

void main()
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}