import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const ShaderMesh = ({
  vertex,
  fragment,
}: {
  vertex: string;
  fragment: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  var textureLoader = new THREE.TextureLoader();
  var texture = textureLoader.load(
    "/shaders/berelium-hydrogen-orbitals/channel0.glsl"
  );

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

  // Define the shader uniforms with memoization to optimize performance
  const uniforms = useMemo(
    () => ({
      uTime: {
        type: "f",
        value: 1.0,
      },
      uResolution: {
        type: "v2",
        value: new THREE.Vector2(dimensions.width, dimensions.height),
      },
      uFrame: {
        type: "i",
        value: 1,
      },
      uN: {
        type: "i",
        value: 3,
      },
      uL: {
        type: "i",
        value: 2,
      },
      uM: {
        type: "i",
        value: 0,
      },
      uChannel0: {
        type: "t",
        value: texture,
      },
    }),
    []
  );

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[dimensions.width, dimensions.height]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default ShaderMesh;
