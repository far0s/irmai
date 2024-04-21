import React, { useState, useRef } from "react";
import s from "./pressAndHoldCTA.module.css";

const PressAndHoldCTA = ({
  onBeginPress,
  onEndPress,
  pressDuration = 2000,
}: {
  onBeginPress: () => void;
  onEndPress: () => void;
  pressDuration?: number;
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onLongPress = () => {
    console.log("onLongPress");
    onEndPress();
  };

  const handlePress = () => {
    setIsPressed(true);
    onBeginPress();
    timeout.current = setTimeout(() => {
      setIsPressed(false);
      onLongPress();
    }, pressDuration);
  };

  const handleRelease = () => {
    setIsPressed(false);
    timeout.current && clearTimeout(timeout.current);
  };

  return (
    <button
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      data-is-pressed={isPressed}
      className={s.pressAndHoldCTA}
      style={
        { "--press-duration": `${pressDuration}ms` } as React.CSSProperties
      }
    >
      <div className={s.circleWrapper}>
        <span className={s.circleGlow}></span>
      </div>
      <span className={s.copy}>
        Press and
        <br />
        hold
      </span>
      <span className={s.copyWhilePress}>Keep holding</span>
      <span></span>
    </button>
  );
};

export default PressAndHoldCTA;
