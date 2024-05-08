import React, { memo, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";

import { fetchGLSL } from "@/utils";

import s from "./background.module.css";

import Aura from "./Aura";

const Background = () => {
  const [vertex, setVertex] = useState("");
  const [fragment, setFragment] = useState("");

  useEffect(() => {
    fetchGLSL("/shaders/aura-noise-figma/vertex.glsl", setVertex);
    fetchGLSL("/shaders/aura-noise-figma/fragment.glsl", setFragment);
  }, []);

  return (
    <div className={s.background}>
      <Canvas style={{ width: "100vw", height: "100vh" }}>
        <Suspense fallback={null}>
          {vertex && fragment && <Aura vertex={vertex} fragment={fragment} />}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default memo(Background);