import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import { convertHexToVec3, lerp } from "@/utils";
import useAudioLevels from "@/hooks/use-audio-levels";
import useTranscript from "@/hooks/use-transcript";

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
  u_startColor: {
    value: "#194c66",
  },
  u_midColor: {
    value: "#6a13a4",
  },
  u_endColor: {
    value: "#7f3f4c",
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

const Aura = ({
  vertex,
  fragment,
  assistantProps,
}: {
  vertex: string;
  fragment: string;
  assistantProps?: any;
}) => {
  const { isMicReady, isListening, isThinking, isSpeaking } = useIrmaiStore(
    (s) => s
  );
  const meshRef = useRef<THREE.Mesh>(null!);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { messages } = assistantProps;
  const transcript = messages?.length > 0 ? useTranscript(messages) : [];
  const [transcriptLength, setTranscriptLength] = useState(0);

  useEffect(() => {
    transcript.length > transcriptLength &&
      setTranscriptLength(transcript.length);
  }, [transcript]);

  const {
    u_speed,
    u_detail,
    u_startColor,
    u_midColor,
    u_endColor,
    u_scale,
    u_distance,
    u_bloom,
    u_center_size,
    u_complexity,
  } = useControls(initControls);

  const audioLevels: Uint8Array | null = useAudioLevels({
    isReady: isMicReady,
    isOn: isListening || isSpeaking,
    numLevels: 1 + 20 * u_detail,
  });

  useFrame((state) => {
    if (!meshRef.current) return;
    let time = state.clock.getElapsedTime();
    const isReady = time > 15;
    const { uniforms } = meshRef.current.material as THREE.ShaderMaterial;

    uniforms.u_time.value = time + 1;
    uniforms.u_resolution.value.set(dimensions.width, dimensions.height);
    uniforms.u_speed.value = lerp(uniforms.u_speed.value, u_speed, 0.1);
    uniforms.u_detail.value = u_detail;
    uniforms.u_startColor.value = convertHexToVec3(u_startColor);
    uniforms.u_midColor.value = convertHexToVec3(u_midColor);
    uniforms.u_endColor.value = convertHexToVec3(u_endColor);
    uniforms.u_scale.value = lerp(
      uniforms.u_scale.value,
      u_scale,
      isReady ? 0.01 : 0.002
    );
    uniforms.u_distance.value = lerp(
      uniforms.u_distance.value,
      u_distance,
      0.1
    );
    uniforms.u_bloom.value = lerp(uniforms.u_bloom.value, u_bloom, 0.1);
    uniforms.u_center_size.value = lerp(
      uniforms.u_center_size.value,
      isSpeaking ? 2.0 : u_center_size,
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
      u_startColor: { value: convertHexToVec3(u_startColor) },
      u_midColor: { value: convertHexToVec3(u_midColor) },
      u_endColor: { value: convertHexToVec3(u_endColor) },
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
