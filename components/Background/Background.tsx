import React, { memo, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";

import s from "./background.module.css";

import AuraMesh from "./AuraMesh";

const Background = () => {
  const [vertex, setVertex] = useState("");
  const [fragment, setFragment] = useState("");

  useEffect(() => {
    fetch("/shaders/aura-noise-figma/vertexShader.glsl")
      .then((response) => response.text())
      .then((data) => setVertex(data));

    fetch("/shaders/aura-noise-figma/fragmentShader.glsl")
      .then((response) => response.text())
      .then((data) => setFragment(data));
  }, []);

  return (
    <div className={s.background}>
      <Canvas style={{ width: "100vw", height: "100vw" }}>
        <Suspense fallback={null}>
          {vertex && fragment && (
            <AuraMesh vertex={vertex} fragment={fragment} />
          )}
        </Suspense>
        <Stats className={s.stats} />
      </Canvas>
    </div>
  );
};

export default memo(Background);
