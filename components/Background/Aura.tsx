import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import { convertHexToVec3, lerp, lerpVec3 } from "@/utils";
import useAudioLevels from "@/hooks/use-audio-levels";

const initControls = {
  u_detail: {
    value: 0.1,
    min: 0.0,
    max: 0.5,
    step: 0.001,
  },
  u_scale: {
    value: 1.0,
    min: 0.0,
    max: 5.0,
    step: 0.01,
  },
  u_bloom: {
    value: 2.5,
    min: 0.0,
    max: 20.0,
    step: 0.01,
  },
  u_complexity: {
    value: 2.0,
    min: 0.0,
    max: 5.0,
    step: 0.01,
  },
};

const Aura = ({
  vertex,
  fragment,
  transcriptLength,
  randomSeed,
}: {
  vertex: string;
  fragment: string;
  transcriptLength: number;
  randomSeed: number;
}) => {
  const { isMicReady, isListening, isThinking, isSpeaking, auraColors } =
    useIrmaiStore((s) => s);
  const meshRef = useRef<THREE.Mesh>(null!);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { u_detail, u_scale, u_bloom, u_complexity } =
    useControls(initControls);

  const audioLevels: Uint8Array | null = useAudioLevels({
    isReady: isMicReady,
    isOn: isListening || isSpeaking,
    numLevels: 1 + 20 * u_detail,
  });

  useFrame((state) => {
    if (!meshRef.current) return;
    let time = state.clock.getElapsedTime();
    const isReady = time > 15;
    const cardsAreVisible =
      document.querySelectorAll(
        "[class*='pageContainer'][class*='cards-visible']"
      ).length > 0;
    const { uniforms } = meshRef.current.material as THREE.ShaderMaterial;

    uniforms.u_time.value = time + 1;
    uniforms.u_resolution.value.set(dimensions.width, dimensions.height);
    uniforms.u_detail.value = u_detail;
    uniforms.u_startColor.value = lerpVec3(
      uniforms.u_startColor.value,
      convertHexToVec3(auraColors.startColor || "#194c66"),
      0.1
    );

    uniforms.u_midColor.value = lerpVec3(
      uniforms.u_midColor.value,
      convertHexToVec3(auraColors.midColor || "#6a13a4"),
      0.1
    );

    uniforms.u_endColor.value = lerpVec3(
      uniforms.u_endColor.value,
      convertHexToVec3(auraColors.endColor || "#7f3f4c"),
      0.1
    );
    uniforms.u_scale.value = lerp(
      uniforms.u_scale.value,
      cardsAreVisible ? 0.25 : u_scale,
      isReady ? 0.01 : 0.005
    );
    uniforms.u_bloom.value = lerp(
      uniforms.u_bloom.value,
      cardsAreVisible ? 7.5 : u_bloom,
      0.1
    );
    uniforms.u_center_size.value = lerp(
      uniforms.u_center_size.value,
      isSpeaking ? 2.0 : 0.0,
      0.1
    );
    uniforms.u_complexity.value = lerp(
      uniforms.u_complexity.value,
      u_complexity + transcriptLength * 0.25,
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
      u_startColor: { value: convertHexToVec3("#194c66") },
      u_midColor: { value: convertHexToVec3("#6a13a4") },
      u_endColor: { value: convertHexToVec3("#7f3f4c") },
      u_background: { value: new THREE.Vector4(0.043, 0.008, 0.086, 1.0) },
      u_speed: { value: 0.6 },
      u_detail: { value: u_detail },
      u_scale: { value: 0.0 },
      u_distance: { value: 2.5 },
      u_bloom: { value: u_bloom },
      u_center_size: { value: 0.0 },
      u_complexity: { value: 0.0 },
      u_audioLevels: { value: new Uint8Array(20) },
      u_randomSeed: { value: randomSeed },
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
