"use client";
import { useEffect, useRef } from "react";

import s from "./logo.module.css";

const Logo = () => {
  const logoRef = useRef<SVGSVGElement>(null);

  const generateRandomDelaysForLetters = () => {
    const paths = logoRef.current?.querySelectorAll("path");
    if (!paths) return;
    const randomDelays = Array.from({ length: paths.length }, () =>
      (Math.random() * 0.5 + 0.75).toFixed(2)
    );
    paths.forEach((path, i) => {
      path.style.transitionDelay = `${randomDelays[i]}s`;
      path.classList.add("isReady");
    });
  };

  useEffect(() => {
    generateRandomDelaysForLetters();
  }, []);

  return (
    <h1>
      <span className={s.title} aria-hidden="true">
        irmai
      </span>
      <svg
        className={s.logo}
        width="196"
        height="50"
        viewBox="0 0 196 50"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        ref={logoRef}
      >
        <path d="M189.6 41c0 2.1.5 3.6 1.5 4.4 1 .8 2.3 1.2 4 1.2v1.9H176.3v-2c1.7 0 3-.3 4-1 1-.9 1.5-2.4 1.5-4.5V9c0-2.1-.5-3.6-1.5-4.3-1-.8-2.3-1.3-4-1.3V1.6h13.4V41Z" />
        <path d="M162.3 48.5v-14h-.4a25 25 0 0 1-5 10.5c-2.3 2.8-5.8 4.2-10.3 4.2-4.1 0-7.3-1.3-9.7-4-2.3-2.6-3.4-6.7-3.4-12.2 0-3 .4-5.7 1.1-8.4l30.4-3v2l-23 4.1c-.5 1.7-.7 3.7-.7 6 0 3.4.6 6 1.8 8 1.3 1.7 3.3 2.6 6 2.6 2.8 0 5.3-1.1 7.2-3.3 2-2.2 3.3-5.2 4.2-8.8 1-3.8 1.5-8 1.5-12.5 0-4.7-.8-8.4-2.5-11-1.6-2.8-4.3-4.1-8.2-4.1-3 0-5.4.8-7 2.4a7.7 7.7 0 0 0-2.4 5.8c0 .8 0 1.6.3 2.3.3.6.6 1.2 1 1.6v.3l-7.9.9A11.6 11.6 0 0 1 139 4.5c3-2.6 7.3-3.9 13-3.9 5 0 8.9 1.1 11.4 3.4 2.7 2.2 4.3 4.8 5 8 .7 3 1 6.7 1 11v18c0 2.1.5 3.6 1.5 4.4 1 .8 2.3 1.2 4 1.2v1.9h-12.5Z" />
        <path d="M99.6 29.8H97V14h3c.5-3.5 1.9-6.6 4.2-9.3 2.3-2.7 5.5-4 9.8-4 4.6 0 8 1.4 10 4.2 2.2 2.8 3.3 6.8 3.3 12.2V41c0 2.1.5 3.6 1.5 4.4 1 .8 2.2 1.2 3.9 1.2v1.9h-18.8v-2c1.8 0 3.1-.3 4-1 1-.9 1.5-2.4 1.5-4.5V18.4c0-4.8-.5-8.2-1.6-10.3-1-2.1-3.1-3.2-6.2-3.2-3.5 0-6.4 2-8.7 5.9-2.2 4-3.3 10.3-3.3 19Zm-27.3 0h-2.7v-16h3c.5-3.3 1.9-6.3 4-9C79 2 82.4.6 86.7.6c4.5 0 7.8 1.5 9.9 4.3 2 2.8 3.1 6.8 3.1 12.2V41c0 2.1.5 3.6 1.5 4.4 1 .8 2.3 1.2 4 1.2v1.9H86.3v-2c1.7 0 3-.3 4-1 1-.9 1.5-2.4 1.5-4.5V18.4c0-4.8-.5-8.2-1.6-10.3C89.2 6 87 4.9 84 4.9c-3.4 0-6.2 2-8.4 5.8a40.2 40.2 0 0 0-3.4 19Zm0 11.2c0 2.1.5 3.6 1.5 4.4 1 .8 2.3 1.2 4 1.2v1.9H59v-2c1.7 0 3-.3 4-1 1-.9 1.5-2.4 1.5-4.5V9c0-2.1-.5-3.6-1.5-4.3a6 6 0 0 0-4-1.3V1.6h13.4V41Z" />
        <path d="M35.1 41c0 2.1.5 3.6 1.5 4.4 1 .8 2.2 1.2 3.9 1.2v1.9H21.7v-2c1.8 0 3.1-.3 4-1 1-.9 1.5-2.4 1.5-4.5V9c0-2.1-.5-3.6-1.4-4.3a6 6 0 0 0-4-1.3V1.6h13.4V41Zm.2-22.7c.8-4.7 2.3-8.7 4.5-12.2C42 2.7 45.2 1 49.2 1c1.8 0 3.4.4 4.9 1a7 7 0 0 1 3.3 2.6L54.3 13l-.7-.2a5 5 0 0 0-1.6-4c-1-1.1-2.7-1.7-4.8-1.7-3.6 0-6.5 2-8.8 6.3a48.8 48.8 0 0 0-3.3 21.2h-2.7V18.3h3Z" />
        <path d="M14 41c0 2.1.4 3.6 1.4 4.4 1 .8 2.3 1.2 4 1.2v1.9H.6v-2c1.7 0 3-.3 4-1C5.6 44.5 6 43 6 41V9c0-2.1-.5-3.6-1.5-4.3-1-.8-2.3-1.3-4-1.3V1.6H14V41Z" />
      </svg>
    </h1>
  );
};

export default Logo;
