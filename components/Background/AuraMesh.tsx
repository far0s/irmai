import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const AuraMesh = ({
  vertex,
  fragment,
}: {
  vertex: string;
  fragment: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerWidth,
  });

  useFrame((state) => {
    let time = state.clock.getElapsedTime();

    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = time + 1;
      material.uniforms.u_resolution.value.set(
        dimensions.width,
        dimensions.height
      );
    }
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerWidth });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const uniforms = useMemo(() => {
    return {
      u_resolution: { value: new THREE.Vector2() },
      u_time: { value: 0 },
      u_color: { value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
      u_background: { value: new THREE.Vector4(0.043, 0.008, 0.086, 1.0) },
      u_speed: { value: 1.0 },
      u_detail: { value: 0.1 },
    };
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={1} rotation={[0, 0, 0]}>
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

export default AuraMesh;
