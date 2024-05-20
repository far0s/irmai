// heavily copied/inspired by the "Noise & Texture" plugin in Figma
// which allows to generate noise textures with a lot of control
// this one is based on the "Aura" preset

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color;
uniform vec3 u_color2;
uniform float u_colorLimit;
uniform vec4 u_background;
uniform float u_speed;
uniform float u_detail;
uniform float u_scale;
uniform float u_distance;
uniform float u_bloom;
uniform float u_center_size;
uniform float u_complexity;
uniform float u_audioLevels[20];
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
  p.xz *= m(t * 0.4);
  p.xy*= m(t * 0.1);
  vec3 q = p * u_complexity + t;
  return length(p+vec3(sin((t*u_speed) * 0.1))) * log(length(p) + 0.9) + cos(q.x + sin(q.z + cos(q.y))) * 0.5 - u_distance;
}

void mainImage ( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 a = (fragCoord.xy - u_resolution.xy) / max(u_resolution.y, u_resolution.x) * -3.0 * u_scale;
  vec3 cl = vec3(0.0);
  float d = 2.5;

  for (float i = 0.; i <= (1. + 20. * u_detail); i++) {
    vec3 p = vec3(0, 0, 4.0) + normalize(vec3(a, -1.0)) * d;
    float rz = map(p);
    float f =  clamp((rz - map(p + 0.1)) * 0.5, -u_colorLimit, u_colorLimit);
    vec3 startColor = u_color;
    vec3 endColor = u_color2 * 10.0;
    vec3 l = startColor + endColor * f;
    float audioBoost = u_audioLevels[int(i)] / 50.0;
    cl = cl * l + smoothstep(u_bloom + audioBoost , u_center_size, rz) * 1.0 * l;
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