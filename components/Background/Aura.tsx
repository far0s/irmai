import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import { convertHexToVec3 } from "@/utils";
import useAudioLevels from "@/hooks/use-audio-levels";

const initControls = {
  u_speed: {
    value: 0.6,
    min: 0.0,
    max: 2.0,
    step: 0.01,
  },
  u_detail: {
    value: 0.1,
    min: 0.0,
    max: 0.5,
    step: 0.001,
  },
  u_color: {
    value: "#194c66",
  },
  u_color2: {
    value: "#7f3f4c",
  },
  u_colorLimit: {
    value: 0.1,
    min: 0.0,
    max: 0.5,
    step: 0.01,
  },
  u_scale: {
    value: 1.0,
    min: 0.0,
    max: 5.0,
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
};

const Aura = ({ vertex, fragment }: { vertex: string; fragment: string }) => {
  const { isMicReady, isListening, isThinking, isSpeaking } = useIrmaiStore(
    (s) => s
  );
  const meshRef = useRef<THREE.Mesh>(null!);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const {
    u_speed,
    u_detail,
    u_color,
    u_color2,
    u_colorLimit,
    u_scale,
    u_distance,
    u_bloom,
    u_center_size,
    u_complexity,
  } = useControls(initControls);

  const audioLevels: Uint8Array | null = useAudioLevels({
    isReady: isMicReady,
    isOn: isListening,
    numLevels: 1 + 20 * u_detail,
  });

  useFrame((state) => {
    if (!meshRef.current) return;
    let time = state.clock.getElapsedTime();
    const isReady = time > 15;
    const { uniforms } = meshRef.current.material as THREE.ShaderMaterial;

    uniforms.u_time.value = time + 1;
    uniforms.u_resolution.value.set(dimensions.width, dimensions.height);
    uniforms.u_speed.value = u_speed;
    uniforms.u_detail.value = u_detail;
    uniforms.u_color.value = convertHexToVec3(u_color);
    uniforms.u_color2.value = convertHexToVec3(u_color2);
    uniforms.u_colorLimit.value = u_colorLimit;
    uniforms.u_scale.value = THREE.MathUtils.lerp(
      uniforms.u_scale.value,
      u_scale,
      isReady ? 0.01 : 0.002
    );
    uniforms.u_distance.value = u_distance;
    uniforms.u_bloom.value = u_bloom;
    uniforms.u_center_size.value = u_center_size;
    uniforms.u_complexity.value = THREE.MathUtils.lerp(
      uniforms.u_complexity.value,
      isSpeaking ? 2.5 : u_complexity,
      0.01
    );

    uniforms.u_audioLevels.value =
      isListening || isSpeaking ? audioLevels : new Array(20).fill(0);
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
      u_time: { value: new Date().getTime() },
      u_color: { value: convertHexToVec3(u_color) },
      u_color2: { value: convertHexToVec3(u_color2) },
      u_colorLimit: { value: u_colorLimit },
      u_background: { value: new THREE.Vector4(0.043, 0.008, 0.086, 1.0) },
      u_speed: { value: u_speed },
      u_detail: { value: u_detail },
      u_scale: { value: 0.0 },
      u_distance: { value: u_distance },
      u_bloom: { value: u_bloom },
      u_center_size: { value: u_center_size },
      u_complexity: { value: 0.0 },
      u_audioLevels: { value: new Uint8Array(20) },
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
