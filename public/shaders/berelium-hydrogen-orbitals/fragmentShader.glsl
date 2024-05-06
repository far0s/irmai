uniform float uTime;
uniform vec2 uResolution;
uniform int uFrame;
uniform int uN;
uniform int uL;
uniform int uM;
uniform sampler2D uChannel0;
varying vec2 vUv;

// Fork of "Orbitals of the Hydrogen Atom" by tpfto. https://shadertoy.com/view/tlX3WN
// 2024-01-29 07:13:49

// The MIT License
// Copyright © 2019 J. M.
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Plotting the density functions (orbitals, Schrödinger equation solutions) for the hydrogen atom, cf. https://en.wikipedia.org/wiki/Atomic_orbital

//
// Note from @berelium:
// This work was modified to allow some interaction with UI sliders found elsewhere as well as using blackbody radiation palette for rendering
// Invalid quantum arrangements are protected, as otherwise the screen would be blank.
// If there is an invalid quantum for example M > L, by default M == L. Ex. 423 == 422
// The sliders rounding isnt exactly perfect, but it works well enough for this purpose...
// Edited 1/30/2024 to add more range
// Edited 2/6/2024 to fix the slider rounding a bit
//

#define PI 3.14159265359

// maximum supported polynomial order
#define MAX_N 6

// Kronecker delta
#define kd(n, k) ((n == k) ? 1.0 : 0.0)

// Clenshaw's algorithm for the Laguerre polynomial
float laguerre(int n, int aa, float x)
{
	float a = float(aa);
    float u = 0.0, v = 0.0, w = 0.0;

    for (int k = MAX_N; k > 0; k--)
    {
      float kk = float(k);
      w = v; v = u;
      u = kd(n, k) + (2.0 * kk + a + 1.0 - x)/(kk + 1.0) * v - (kk + a + 1.0) * w/(kk + 2.0);
    }

    return kd(n, 0) + (a - x + 1.0) * u - 0.5 * (a + 1.0) * v;
}

// Clenshaw's algorithm for the normalized associated Legendre polynomial (spherical harmonics)
float alegp(int n, int m, float x)
{
  int am = abs(m);
  float u = 0.0, v = 0.0, w = 0.0;

  for (int k = MAX_N; k >= 0; k--)
  {
    float kp = float(k + 1);
    float mk1 = float(2 * am) + kp, mk2 = float(2 * (am + k) + 1);
    w = v; v = u;
    u = kd(n, am + k) + sqrt((mk2 * (mk2 + 2.0))/(kp * mk1)) * x * v - sqrt((kp * mk1 * (mk2 + 4.0))/((kp + 1.0) * (mk1 + 1.0) * mk2)) * w;
  }

  for (int k = 1; k <= am; k++)
  {
    u *= sqrt((1.0 - 0.5/float(k)) * (1.0 - x) * (1.0 + x));
  }

  return (((m > 0) && ((am & 1) == 1)) ? -1.0 : 1.0) * u * sqrt((0.5 * float(am) + 0.25)/PI);
}


// Credits to @Shane
vec3 blackbody( float i ) {
  float T = 1400. + 1400.*i; // Temperature range (in Kelvin).
  vec3 L = vec3(7.4, 5.6, 4.4); // Red, green, blue wavelengths (in hundreds of nanometers).
  L = pow(L,vec3(5.0)) * (exp(1.43876719683e5/(T*L))-1.0);
  return 1.0-exp(-5e8/L); // Exposure level. Set to "50." For "70," change the "5" to a "7," etc.
}


// density function
float hdensity(int n, int l, int m, vec2 p)
{
  float r = length(p);

  float rho = 2.0 * r/float(n);
  float tmp = laguerre(n - l - 1, 2 * l + 1, rho) * alegp(l, m, p.y/r);

  return exp(2.0 * float(l + 1) * log(0.5 * rho) - rho) * tmp * tmp;
}

// Credits to @XT95 (https://www.shadertoy.com/view/ldKSDm)
float uiSlider(int id){return texture(uChannel0, vec2(float(id)+.5,0.5)/uResolution.xy).r;}

void main()
{
  vec2 fragCoord = vUv * uResolution;
  vec2 uv = 2.0 * (fragCoord.xy - 0.5 * uResolution.xy) / max(uResolution.x, uResolution.y);

  // The principal quantum (n) range is from 2-4, with the slider split in 3rds { < .25 == 2, < .75 == 3, else == 4 }
  // The angular momentum quantum is dependent on the principal, with 1 less than N allowed as max.
  // The angular momentum projection quantum is dependent on the previous, having the same max range as it.
  int n = int(2.0 + (5.0 - 2.0) * (uiSlider(0) + 0.25));
  int l = int(float(n-1) * uiSlider(1) + 0.5);
  int m = int(float(l) * uiSlider(2) + 0.5);

  // Some hokey mapped scaling
  uv *= n == 2 ? 25. : n == 3 ? 60. : n == 4 ? 110. : 175.;

  float d = hdensity(n, l, m, uv);
  d *= float(MAX_N - n);
  d = pow(d, 1.0 / 2.2);

  // Apply blackbody palette along with ACES and gamma correction
  vec3 col = blackbody(d);
  col = (col*(2.51*col+0.03))/(col*(2.43*col+0.59)+0.14);
  col = pow(col, vec3(1.0 / 2.2));

  vec4 ui = texture(uChannel0, fragCoord.xy/uResolution.xy);
  col = mix(col,ui.rgb, ui.a*.8);

  gl_FragColor = vec4(col, 1.0);
}