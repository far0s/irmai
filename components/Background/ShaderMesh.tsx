import React, { useRef, useEffect, useState, useMemo, Suspense } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function hydrogenOrbital(
  n: number,
  l: number,
  m: number,
  x: number,
  y: number,
  z: number
) {
  // Implement the mathematical formula for the hydrogen orbital
  let r = Math.sqrt(x * x + y * y + z * z);
  let theta = Math.acos(z / r);
  let phi = Math.atan2(y, x);

  let rho = (2 * r) / n;
  let laguerre =
    Math.pow(2 / n, 3) *
    Math.pow(rho, l) *
    Math.exp(-rho / 2) *
    Math.pow(rho, Math.abs(m));

  let associatedLegendre =
    Math.sqrt(
      ((2 * l + 1) * factorial(l - Math.abs(m))) /
        (4 * Math.PI * factorial(l + Math.abs(m)))
    ) *
    Math.pow(Math.sin(theta), Math.abs(m)) *
    Math.pow(Math.cos(theta), l) *
    Math.exp(1 * m * phi);

  return Math.pow(rho, l) * Math.exp(-rho / 2) * associatedLegendre;
}

function factorial(n: number): number {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}

function generate3DTexture({
  n,
  l,
  m,
  size,
}: {
  n: number;
  l: number;
  m: number;
  size: number;
}) {
  let data = new Float32Array(size * size * size);
  for (let z = 0; z < size; z++) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let value = hydrogenOrbital(
          n,
          l,
          m,
          x - size / 2,
          y - size / 2,
          z - size / 2
        );
        data[x + y * size + z * size * size] = value;
      }
    }
  }

  // Step 3: Normalize the data
  let max = -Infinity;
  for (let i = 0, length = data.length; i < length; i++) {
    if (data[i] > max) {
      max = data[i];
    }
  }
  data = data.map((value) => value / max);

  let texture = new THREE.Data3DTexture(data, size, size, size);
  texture.format = THREE.RedFormat;
  texture.type = THREE.FloatType;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.unpackAlignment = 1;

  return texture;
}

const ShaderMesh = () => {
  const [vertex, setVertex] = useState("");
  const [fragment, setFragment] = useState("");
  const meshRef = useRef<THREE.Mesh>(null!);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  // const [texture3D, setTexture3D] = useState();

  const n = 3;
  const l = 1;
  const m = 0;
  let size = 128;

  const texture3D = useMemo(() => generate3DTexture({ n, l, m, size }), []);

  useFrame((state) => {
    let time = state.clock.getElapsedTime();

    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = time + 1;
      material.uniforms.uResolution.value.set(
        dimensions.width,
        dimensions.height
      );
      material.uniforms.uFrame.value += 1;
      material.uniforms.uOrbitalTexture.value = texture3D;
      material.uniforms.uCameraPosition.value = state.camera.position;
    }
  });

  // Update the dimensions state when the window size changes
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setVertex(`
      varying vec2 vUv;
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
        gl_Position = projectionPosition;
        vUv = uv;
      }
    `);

    setFragment(`
      // FIXME: this doesn't work
      // no errors, but no output either
      uniform sampler3D uOrbitalTexture;
      uniform vec3 uCameraPosition;

      #define MAX_STEPS 256
      #define STEP_SIZE 4.0

      varying vec2 vUv;

      void main() {
        vec3 rayOrigin = uCameraPosition;
        // vec3 rayDirection = normalize(gl_FragCoord.xyz - uCameraPosition);
        vec3 rayDirection = normalize(vec3(vUv - 0.5, 1.0));

        float t = 1.0;
        vec4 accumulatedColor = vec4(0.0);
        for (int i = 0; i < MAX_STEPS; i++) {
          vec3 position = rayOrigin + t * rayDirection;
          float density = texture(uOrbitalTexture, vec3(vUv, position.z)).r;
          vec4 color = vec4(density);
          accumulatedColor = mix(accumulatedColor, color, density);
          t += STEP_SIZE;
        }

        gl_FragColor = accumulatedColor;
      }
    `);
  }, []);

  // Define the shader uniforms with memoization to optimize performance
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
      uResolution: { value: new THREE.Vector2() },
      uFrame: { value: 0 },
      uOrbitalTexture: { value: texture3D },
      uCameraPosition: { value: new THREE.Vector3() },
    }),
    []
  );

  return (
    vertex &&
    fragment &&
    uniforms && (
      <Suspense fallback={null}>
        <mesh ref={meshRef}>
          <planeGeometry args={[dimensions.width, dimensions.height]} />
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={vertex}
            fragmentShader={fragment}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Suspense>
    )
  );
};

export default ShaderMesh;
