// source: https://www.shadertoy.com/view/fsfyWf
uniform float u_time;
uniform vec2 u_resolution;
uniform int u_frame;
uniform vec4 u_background;
uniform float n;
uniform float l;
uniform float m;
uniform float u_scale;
uniform vec3 u_pos_color;
uniform vec3 u_neg_color;
uniform float u_exposure;
uniform float u_opacity;
uniform vec3 u_att_color;
varying vec2 vUv;

// ####### Hydrogen Orbitals #######
// Made by Jacob Bingham (Zi7ar21) on January 21st, 2022

// Last Updated on January 22nd, 2022 at 03:05 Mountain Standard Time

// If you found this anywhere except Shadertoy, you can find the original and possibly updated version at:
// https://www.shadertoy.com/view/fsfyWf

// based on https://en.wikipedia.org/wiki/Hydrogen_atom#Schr%C3%B6dinger_equation

/*
I have no clue if this is actually correct...
I just used the "Schrodinger Equation" section on the "Hydrogen atom" Wikipedia
article (aaaaand ~~stole~~ made use of Inigo Quilez's Spherical Harmonics shader...)
*/

/*
## Features

- Arbitrary (n, l, m) ( scroll down to Parameters to adjust, the default is (3, 2, 0) )
- Volumetrics
  - Ray-Marching
  - Scattering
  - Dithering with Interleaved Gradient Noise

## Limitations/TODO

- Generalized Laguerre Polynomial not taken into account
  - I have no idea what this is and how to use it, it seems to not be
    neccesary and so it's currently ommited
- Spherical Harmonics Problems
  - This only supports Real Spherical Harmonics
  - Pre-solved Spherical Harmonics only up to l = 3
    - Solving arbitrary spherical harmonics for l and m would be cool...
      of course, it probably wouldn't perform very great and so it would
      only be used for l > 3
*/

/*
# Zi7ar21's Epic License

This applies to...

- Code I wrote
  - You must respect the individual licenses of any snippets in the source that aren't mine

You are free to...

- Use this code however you want (as long as it complies with this license)
  - e.g. personal and commercial projects
  - Especially open-source projects

As long as...

- You use it ethically
  - e.g. no using it for NFT's, which are unsustainable and stupid
- You keep comments in the source that credit and link to snippets of code that aren't mine
  - e.g. Comments such as "PCG Random: https://www.pcg-random.org/"
  - Of course, you must also respect whatever licenses they use

Remember, we are programmers, not lawyers! :)
*/

// ##### Parameters #####

// n = principal quantum number
// l = azimuthal quantum number
// m = magnetic quantum number

#define EXPOSURE u_exposure

// uncomment for orthographic camera
#define ORTHO

#define FOV 20.0

#define STEP_SIZE 4.0

#define STEP_SIZE_SHADOW 0.4

#define CUTOFF 0.008
#define DENSITY 16.0

/* 
// ##### Configuration Validation #####

// ### make sure n is valid ###

#if n < 1
#error n must be greater than 0
#endif

// ### make sure l is valid ###

#if l < 0
#error l must be greater than or equal to 0
#endif

#if l >= n
#error l must be less than n
#endif

// ### make sure m is valid ###

#if m > l || -m > l
#error m must be less than or equal to abs(l)
#endif */

// ##### Constants #####

// http://www.mimirgames.com/articles/programming/digits-of-pi-needed-for-floating-point-numbers/
const float pi     = 3.141592653589793; // Pi
const float two_pi = 6.283185307179586; // 2 * Pi
const float inv_pi = 0.318309886183790; // 1 / Pi

// Reduced Bohr Radius
// 5.2946541 * 10 ^ -11 meters
// 0.52946541 angstrom
// https://en.wikipedia.org/wiki/Bohr_radius#Hydrogen_atom_and_similar_systems
const float a0 = 0.52946541;

// ##### Maths #####

//#define dot_product(x) dot(x, x)

float dot_product(vec2 x) { return dot(x, x); }
float dot_product(vec3 x) { return dot(x, x); }
float dot_product(vec4 x) { return dot(x, x); }

vec2 rotate(vec2 vector, float theta)
{
	float s = sin(theta), c = cos(theta);
	return vec2(vector.x * c - vector.y * s, vector.x * s + vector.y * c);
}

float factorial(float x)
{
	float f = 1.0;

	for(float i = 1.0; i <= x; i++)
	{
		f = f * i;
	}

	return f;
}

// (x, y, z) -> (r, theta, phi)
vec3 cartesian2spherical(vec3 p)
{
	return vec3(
		length(p), // r
		atan(p.y, p.x), // theta
		atan(length(p.xy), p.z) // phi
	);
}

// (r, theta, phi) -> (x, y, z)
vec3 spherical2cartesian(vec3 p)
{
	float r     = p.x;
	float theta = p.y;
	float phi   = p.z;

	return vec3(
	cos(theta) * sin(phi),
	sin(theta) * sin(phi),
	cos(phi)
	);
}

/*
*/
// modified from https://www.shadertoy.com/view/lsfXWH

// The MIT License
// Copyright © 2014 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// https://www.youtube.com/c/InigoQuilez
// https://iquilezles.org

// Four bands of Spherical Harmonics functions (or atomic orbitals if you want). For
// reference and fun.

// Constants, see here: http://en.wikipedia.org/wiki/Table_of_spherical_harmonics
const float k01 = 0.2820947918; // sqrt(  1 / PI) / 2
const float k02 = 0.4886025119; // sqrt(  3 / PI) / 2
const float k03 = 1.0925484306; // sqrt( 15 / PI) / 2
const float k04 = 0.3153915652; // sqrt(  5 / PI) / 4
const float k05 = 0.5462742153; // sqrt( 15 / PI) / 4
const float k06 = 0.5900435860; // sqrt( 70 / PI) / 8
const float k07 = 2.8906114210; // sqrt(105 / PI) / 2
const float k08 = 0.4570214810; // sqrt( 42 / PI) / 8
const float k09 = 0.3731763300; // sqrt(  7 / PI) / 4
const float k10 = 1.4453057110; // sqrt(105 / PI) / 4
// Band 4
const float k11= 0.2041639326;
const float k12= 0.3322411854;
const float k13= 0.4186264364;
const float k14= 0.4793080678;
const float k15= 0.4077881153;
const float k16= 0.4793080678;
const float k17= 0.4186264364;
const float k18= 0.3322411854;
const float k19= 0.2041639326;
// Band 5
const float k20 = 0.1624598571;
const float k21 = 0.2721626504;
const float k22 = 0.3503023869;
const float k23 = 0.4050674072;
const float k24 = 0.4403442667;
const float k25 = 0.3856652288;
const float k26 = 0.4403442667;
const float k27 = 0.4050674072;
const float k28 = 0.3503023869;
const float k29 = 0.2721626504;
const float k30 = 0.1624598571;
// Band 6
const float k31 = 0.1294069263;
const float k32 = 0.2238103044;
const float k33 = 0.2964176796;
const float k34 = 0.3523839015;
const float k35 = 0.3887843131;
const float k36 = 0.4084729801;
const float k37 = 0.3700632973;
const float k38 = 0.4084729801;
const float k39 = 0.3887843131;
const float k40 = 0.3523839015;
const float k41 = 0.2964176796;
const float k42 = 0.2238103044;
const float k43 = 0.1294069263;


// Y_l_m(s), where l is the band and m the range in [-l..l]
//float SH( in int l, in int m, in vec3 s )
float SH( in vec3 s )
{
	vec3 n_ = s.zxy;

	bool isZero = l == 0.0;
	bool isAbsLBetween0And1 = abs(l) < 1.0 && abs(l) >= 0.0;
	bool isAbsLBetween1And2 = abs(l) < 2.0 && abs(l) >= 1.0;
	bool isAbsLBetween2And3 = abs(l) < 3.0 && abs(l) >= 2.0;
	bool isAbsLBetween3And4 = abs(l) < 4.0 && abs(l) >= 3.0;
	bool isAbsLBetween4And5 = abs(l) < 5.0 && abs(l) >= 4.0;
	bool isAbsMBetween0And1 = abs(m) < 1.0 && abs(m) >= 0.0;
	bool isAbsMBetween1And2 = abs(m) < 2.0 && abs(m) >= 1.0;
	bool isAbsMBetween2And3 = abs(m) < 3.0 && abs(m) >= 2.0;
	bool isAbsMBetween3And4 = abs(m) < 4.0 && abs(m) >= 3.0;
	// float lmFactor = sqrt( (2.0 * l + 1.0) / (4.0 * pi) );
	float lmFactor = 1.0;

	//----------------------------------------------------------
	if( isZero )          return  k01;
	//----------------------------------------------------------
	if( isAbsLBetween0And1 && isAbsMBetween1And2 ) return -k02 * n_.y * lmFactor;
	if( isAbsLBetween0And1 && isAbsMBetween0And1 ) return  k02 * n_.z * lmFactor;
	if( isAbsLBetween0And1 && isAbsMBetween1And2 ) return -k02 * n_.x * lmFactor;
	//----------------------------------------------------------
	if( isAbsLBetween1And2 && isAbsMBetween2And3 ) return  k03 * n_.x * n_.y * lmFactor;
	if( isAbsLBetween1And2 && isAbsMBetween1And2 ) return -k03 * n_.y * n_.z * lmFactor;
	if( isAbsLBetween1And2 && isAbsMBetween0And1 ) return  k04 * (3.0 * n_.z * n_.z - 1.0) * lmFactor;
	if( isAbsLBetween1And2 && isAbsMBetween1And2 ) return -k03 * n_.x * n_.z * lmFactor;
	if( isAbsLBetween1And2 && isAbsMBetween2And3 ) return  k05 * (n_.x * n_.x - n_.y * n_.y) * lmFactor;
	//----------------------------------------------------------
	if( isAbsLBetween2And3 && isAbsMBetween3And4 ) return -k06 * n_.y * (3.0 * n_.x * n_.x - n_.y * n_.y) * lmFactor;
	if( isAbsLBetween2And3 && isAbsMBetween2And3 ) return  k07 * n_.z * n_.y * n_.x * lmFactor;
	if( isAbsLBetween2And3 && isAbsMBetween1And2 ) return -k08 * n_.y * (5.0 * n_.z * n_.z - 1.0) * lmFactor;
	if( isAbsLBetween2And3 && isAbsMBetween0And1 ) return  k09 * n_.z * (5.0 * n_.z * n_.z - 3.0) * lmFactor;
	if( isAbsLBetween2And3 && isAbsMBetween1And2 ) return -k08 * n_.x * (5.0 * n_.z * n_.z - 1.0) * lmFactor;
	if( isAbsLBetween2And3 && isAbsMBetween2And3 ) return  k10 * n_.z * (n_.x * n_.x - n_.y * n_.y) * lmFactor;
	if( isAbsLBetween2And3 && isAbsMBetween3And4 ) return -k06 * n_.x * (n_.x * n_.x - 3.0 * n_.y * n_.y) * lmFactor;
	//----------------------------------------------------------
	if (isAbsLBetween3And4 && m==-4.0) return k11 * n_.x * n_.y * (n_.x * n_.x - n_.y * n_.y) * lmFactor;
	if (isAbsLBetween3And4 && isAbsMBetween3And4) return -k12 * n_.y * (3.0 * n_.x * n_.x - n_.y * n_.y) * n_.z * lmFactor;
	if (isAbsLBetween3And4 && isAbsMBetween2And3) return k13 * n_.z * n_.y * (7.0 * n_.x * n_.x - 1.0) * lmFactor;
	if (isAbsLBetween3And4 && isAbsMBetween1And2) return -k14 * n_.y * (7.0 * n_.z * n_.z - 1.0) * lmFactor;
	if (isAbsLBetween3And4 && isAbsMBetween0And1) return k15 * (35.0 * n_.z * n_.z * n_.z * n_.z - 30.0 * n_.z * n_.z + 3.0) * lmFactor;
	if (isAbsLBetween3And4 && isAbsMBetween1And2) return -k14 * n_.x * (7.0 * n_.z * n_.z - 1.0) * lmFactor;
	if (isAbsLBetween3And4 && isAbsMBetween2And3) return k13 * n_.z * (n_.x * n_.x - n_.y * n_.y) * n_.z * lmFactor;
	if (isAbsLBetween3And4 && isAbsMBetween3And4) return -k12 * n_.x * (n_.x * n_.x - 3.0 * n_.y * n_.y) * n_.z * lmFactor;
	if (isAbsLBetween3And4 && m== 4.0) return k16 * (n_.x * n_.x - n_.y * n_.y) * (n_.x * n_.x - n_.y * n_.y) * lmFactor;
	//----------------------------------------------------------
	if (isAbsLBetween4And5 && m==-5.0) return -k17 * n_.y * (n_.x * n_.x - n_.y * n_.y) * (n_.x * n_.x - n_.y * n_.y) * lmFactor;
	if (isAbsLBetween4And5 && m==-4.0) return k18 * n_.z * n_.y * (n_.x * n_.x - n_.y * n_.y) * n_.z * lmFactor;
	if (isAbsLBetween4And5 && isAbsMBetween3And4) return -k19 * n_.y * (3.0 * n_.x * n_.x - n_.y * n_.y) * (11.0 * n_.z * n_.z - 1.0) * lmFactor;
	if (isAbsLBetween4And5 && isAbsMBetween2And3) return k20 * n_.z * n_.y * (11.0 * n_.z * n_.z - 3.0) * n_.z * lmFactor;
	if (isAbsLBetween4And5 && isAbsMBetween1And2) return -k21 * n_.y * (11.0 * n_.z * n_.z - 3.0) * n_.z * lmFactor;
	if (isAbsLBetween4And5 && isAbsMBetween0And1) return k22 * (231.0 * n_.z * n_.z * n_.z * n_.z * n_.z - 315.0 * n_.z * n_.z * n_.z + 105.0 * n_.z * n_.z - 5.0) * lmFactor;
	if (isAbsLBetween4And5 && isAbsMBetween1And2) return -k21 * n_.x * (11.0 * n_.z * n_.z - 3.0) * n_.z * lmFactor;
	if (isAbsLBetween4And5 && isAbsMBetween2And3) return k20 * n_.z * (n_.x * n_.x - n_.y * n_.y) * (11.0 * n_.z * n_.z - 3.0) * n_.z * lmFactor;
	if (isAbsLBetween4And5 && isAbsMBetween3And4) return -k19 * n_.x * (n_.x * n_.x - 3.0 * n_.y * n_.y) * (11.0 * n_.z * n_.z - 1.0) * lmFactor;
	if (isAbsLBetween4And5 && m== 4.0) return k23 * n_.z * (n_.x * n_.x - n_.y * n_.y) * n_.z * lmFactor;
	if (isAbsLBetween4And5 && m== 5.0) return -k17 * n_.x * (n_.x * n_.x - 3.0 * n_.y * n_.y) * (n_.x * n_.x - n_.y * n_.y) * lmFactor;
	//----------------------------------------------------------
	return 0.0;
}

// Generalized Laguerre Polynomial (not neccesary, I think?)
float L(float rho)
{
	return 1.0;
}

// Spherical Harminic Function
// Wikipedia: "Spherical Harmonic Function of Degree l and Order m"
float Y(float theta, float phi)
{
	vec3 p = spherical2cartesian( vec3(1.0, theta, phi) );
	return SH(p);
}

// Normalized Position Wavefunction
float wavefunction(float r, float theta, float phi)
{
	float rho = (2.0 * r) / (float(n) * a0);
	float f0 = 2.0 / (float(n) * a0);
	float f1 = float( factorial(n - l - 1.0) ) / float( 2.0 * n * factorial(n + l) );
	return sqrt(f0 * f0 * f0 * f1) * exp(-rho / 2.0) * pow( rho, float(l) ) * L(rho) * Y(theta, phi);
}

// ##### Rendering #####

vec3 sky(vec3 dir)
{
	return vec3(0);
	return vec3(1) * 0.8 * smoothstep(0.0, 1.0, dir.y) + 0.2;
}

float sample_volume(in vec3 p, out vec3 col)
{
	col = vec3(0.100, 0.250, 1.000);

	if(dot_product(p) > 32.0 * 32.0)
	{
		return 0.0;
	}

	// this manages the rotation of the volume
	p = vec3(rotate(p.xy, 1.0 * (0.1 / 10.0) * two_pi * u_time), p.z).xyz;
	p = vec3(rotate(p.xz, 2.0 * (0.1 / 10.0) * two_pi * u_time), p.y).xzy;
	p = vec3(rotate(p.yz, 3.0 * (0.1 / 10.0) * two_pi * u_time), p.x).yzx;

	p = cartesian2spherical(p);
	float r     = p.x;
	float theta = p.y;
	float phi   = p.z;

	float w = wavefunction(r, theta, phi);

	if(w > 0.0)
	{
		col = 1.0 - u_pos_color;
	}
	else
	{
		col = 1.0 - u_neg_color;
	}

	return DENSITY * max(abs(w) - CUTOFF, 0.0);
}

vec3 sample_light(vec3 ro, vec3 rd)
{
	vec3 a = vec3(1);

	for(int i = 0; i < 100; i++)
	{
		float t = STEP_SIZE_SHADOW * float(i);

		vec3 p = ro + rd * t;

		vec3 c;
		float d = sample_volume(p, c);

		if(d > 0.0)
		{
			a *= exp(-STEP_SIZE_SHADOW * c * d);
		}
	}

	return a;
}

// https://blog.demofox.org/2022/01/01/interleaved-gradient-noise-a-different-kind-of-low-discrepancy-sequence/
// http://www.iryoku.com/next-generation-post-processing-in-call-of-duty-advanced-warfare
float IGN(vec2 pixel_coord, int frame)
{
	frame = frame % 64;

	pixel_coord += 5.588238 * float(frame);

	return fract( 52.9829189 * fract(0.06711056 * pixel_coord.x + 0.00583715 * pixel_coord.y) );
}

mat2 m2(float a) {
  float c=cos(a), s=sin(a);
  return mat2(c,-s,s,c);
}

float map(vec3 p) {
  float t = u_time * 4.0;
  p.xz *= m2(t * 0.4);
  p.xy*= m2(t * 0.1);
  vec3 q = p * 2.0 + t;
  return length(p+vec3(sin((t*4.0) * 0.1))) * log(length(p) + 0.9) + cos(q.x + sin(q.z + cos(q.y))) * 0.5 - 2.5;
}

// ##### Main #####
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	fragColor = u_background;

	float normalised_scale = float(u_scale) * float(abs(l) + abs(n)) / 4.0;

	vec2 uv = normalised_scale * (fragCoord - u_resolution.xy) / max(u_resolution.x, u_resolution.y);

	vec3 ro = vec3( FOV * uv ,  16.0);
	vec3 rd = vec3( 0.0,  0.0,  -1.0);

	// float theta = 0.125 * two_pi * u_time;

	// ro = vec3(rotate(ro.xz, theta), ro.y).xzy;
	// rd = vec3(rotate(rd.xz, theta), rd.y).xzy;

	vec3 att = u_att_color;
	vec3 col = u_background.rgb;

	float dither = STEP_SIZE * IGN(floor(fragCoord), u_frame);

	for(int i = 0; i < 40; i++)
	{
		float t = ( STEP_SIZE * float(i) ) + dither;

		vec3 p = ro + rd * t;

		#ifndef ORTHO
		if(dot_product(p) > 16.0 * 16.0)
		{
			break;
		}
		#else
		if(dot_product(p) > 32.0 * 32.0)
		{
			break;
		}
		#endif

		vec3 c;
		float d = sample_volume(p, c);

		// vec3 p = vec3(0, 0, 4.0) + normalize(vec3(uv, -1.0)) * d;
		float rz = map(p);
		// float f =  clamp((rz - map(p + 0.1)) * 0.5, -0.1, 0.1);
		// vec3 l = u_pos_color + u_neg_color * f;

		if(d > u_opacity)
		{
			col += STEP_SIZE * att * d * sample_light( p, normalize( vec3(1, 0, 0) ) );

			att *= exp(-STEP_SIZE * d);
			d += min(rz, 1.0);
		}
	}

	fragColor.rgb = col + att * sky(rd);

	#ifdef EXPOSURE
	fragColor.rgb = smoothstep( 0.0, 1.0, 1.0 - exp(-max(fragColor.rgb, 0.0) * EXPOSURE) );
	fragColor = max(u_background, fragColor);
	#endif
}

void main()
{
	mainImage(gl_FragColor, gl_FragCoord.xy);
}