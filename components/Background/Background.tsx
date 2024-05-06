import React, { useEffect, useState, Suspense, memo } from "react";
import { Canvas } from "@react-three/fiber";

import ShaderMesh from "./ShaderMesh";

import s from "./background.module.css";

const Background = () => {
  const [vertex, setVertex] = useState("");
  const [fragment, setFragment] = useState("");

  useEffect(() => {
    fetch("/shaders/hydrogen-orbitals/vertexShader.glsl")
      .then((response) => response.text())
      .then((data) => setVertex(data));

    fetch("/shaders/hydrogen-orbitals/fragmentShader.glsl")
      .then((response) => response.text())
      .then((data) => setFragment(data));
  }, []);

  return (
    <div className={s.background}>
      <Canvas style={{ width: "100vw", height: "100vh" }}>
        <Suspense fallback={null}>
          {vertex && fragment && (
            <ShaderMesh vertex={vertex} fragment={fragment} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default memo(Background);
