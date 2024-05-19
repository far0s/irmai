import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

import { convertHexToVec3, lerp } from "@/utils";

const initControls = {
  n: {
    value: 3.0,
    min: 1.0,
    max: 6.0,
    step: 0.1,
  },
  l: {
    value: 2.0,
    min: 0.0,
    max: 5.0,
    step: 0.01,
  },
  m: {
    value: 0.0,
    min: -4.0,
    max: 4.0,
    step: 0.01,
  },
  u_scale: {
    value: 1.0,
    min: 0.0,
    max: 5.0,
    step: 0.1,
  },
  u_pos_color: {
    value: "#e546d5",
  },
  u_neg_color: {
    value: "#25c0f8",
  },
  u_exposure: {
    value: 1.0,
    min: 0.0,
    max: 2.0,
    step: 0.01,
  },
  u_opacity: {
    value: 0.0,
    min: 0.0,
    max: 1.0,
    step: 0.01,
  },
  u_att_color: {
    value: "#ffffff",
  },
};

const HydrogenOrbitals = ({
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

  const {
    n,
    l,
    m,
    u_scale,
    u_pos_color,
    u_neg_color,
    u_exposure,
    u_opacity,
    u_att_color,
  } = useControls(initControls);

  useFrame((state) => {
    let time = state.clock.getElapsedTime();

    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = time + 1;
      material.uniforms.u_resolution.value.set(
        dimensions.width,
        dimensions.height
      );
      material.uniforms.u_frame.value += 1;
      material.uniforms.n.value = n;
      material.uniforms.l.value = l;
      material.uniforms.m.value = m;
      material.uniforms.u_scale.value = lerp(
        0.5,
        u_scale,
        Math.min(time / 5, 1.0)
      );
      material.uniforms.u_pos_color.value = convertHexToVec3(u_pos_color);
      material.uniforms.u_neg_color.value = convertHexToVec3(u_neg_color);
      material.uniforms.u_exposure.value = u_exposure;
      material.uniforms.u_opacity.value = u_opacity;
      material.uniforms.u_att_color.value = convertHexToVec3(u_att_color);
    }
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
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
      u_time: { value: 0.0 },
      u_frame: { value: 0.0 },
      u_background: { value: new THREE.Vector4(0.043, 0.008, 0.086, 1.0) },
      n: { value: n },
      l: { value: l },
      m: { value: m },
      u_scale: { value: u_scale },
      u_pos_color: { value: convertHexToVec3(u_pos_color) },
      u_neg_color: { value: convertHexToVec3(u_neg_color) },
      u_exposure: { value: u_exposure },
      u_opacity: { value: u_opacity },
      u_att_color: { value: convertHexToVec3(u_att_color) },
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

export default HydrogenOrbitals;
