import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

import { convertHexToVec3, lerp } from "@/utils";

const Aura = ({ vertex, fragment }: { vertex: string; fragment: string }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerWidth,
  });

  const {
    u_speed,
    u_detail,
    u_color,
    u_scale,
    u_distance,
    u_bloom,
    u_center_size,
    u_complexity,
  } = useControls({
    u_speed: {
      value: 1.0,
      min: 0.0,
      max: 4.0,
      step: 0.001,
    },
    u_detail: {
      value: 0.1,
      min: 0.0,
      max: 1.0,
      step: 0.001,
    },
    u_color: {
      value: "#FFFFFF",
    },
    u_scale: {
      value: 1.0,
      min: 0.0,
      max: 10.0,
      step: 0.01,
    },
    u_distance: {
      value: 2.5,
      min: 0.0,
      max: 10.0,
      step: 0.01,
    },
    u_bloom: {
      value: 2.5,
      min: 0.0,
      max: 20.0,
      step: 0.01,
    },
    u_center_size: {
      value: 0.0,
      min: 0.0,
      max: 5.0,
      step: 0.01,
    },
    u_complexity: {
      value: 2.0,
      min: 0.0,
      max: 5.0,
      step: 0.01,
    },
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
      material.uniforms.u_speed.value = u_speed;
      material.uniforms.u_detail.value = u_detail;
      material.uniforms.u_color.value = convertHexToVec3(u_color);
      material.uniforms.u_scale.value = u_scale;
      material.uniforms.u_distance.value = u_distance;
      material.uniforms.u_bloom.value = u_bloom;
      material.uniforms.u_center_size.value = u_center_size;
      material.uniforms.u_complexity.value = u_complexity;
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
      u_resolution: {
        value: new THREE.Vector2(dimensions.width, dimensions.height),
      },
      u_time: { value: new Date().getTime() },
      u_color: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
      u_background: { value: new THREE.Vector4(0.043, 0.008, 0.086, 1.0) },
      u_speed: { value: u_speed },
      u_detail: { value: u_detail },
      u_scale: { value: u_scale },
      u_distance: { value: u_distance },
      u_bloom: { value: u_bloom },
      u_center_size: { value: u_center_size },
      u_complexity: { value: u_complexity },
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

export default Aura;
