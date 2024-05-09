import React, { memo, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";

import { fetchGLSL } from "@/utils";

import s from "./background.module.css";

import Aura from "./Aura";
import HydrogenOrbitals from "./HydrogenOrbitals";

const shaders = [
  {
    id: "aura-noise-figma",
    Component: Aura,
    vertex: "/shaders/aura-noise-figma/vertex.glsl",
    fragment: "/shaders/aura-noise-figma/fragment.glsl",
  },
  {
    id: "hydrogen-orbitals",
    Component: HydrogenOrbitals,
    vertex: "/shaders/hydrogen-orbitals/vertex.glsl",
    fragment: "/shaders/hydrogen-orbitals/fragment.glsl",
  },
];

const Background = () => {
  const [selectedShader, setSelectedShader] = useState<any>(shaders[1]);
  const [vertex, setVertex] = useState("");
  const [fragment, setFragment] = useState("");

  useEffect(() => {
    setVertex("");
    setFragment("");
    fetchGLSL(selectedShader.vertex, setVertex);
    fetchGLSL(selectedShader.fragment, setFragment);
  }, [selectedShader]);

  useControls({
    shader: {
      value: selectedShader.id,
      label: "Shader",
      options: shaders.map(({ id }) => id),
      onChange: (id) => setSelectedShader(shaders.find((s) => s.id === id)),
    },
  });

  return (
    <div className={s.background}>
      <Canvas style={{ width: "100vw", height: "100vh" }} dpr={2}>
        <Suspense fallback={null}>
          {selectedShader && vertex && fragment && (
            <selectedShader.Component vertex={vertex} fragment={fragment} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default memo(Background);
