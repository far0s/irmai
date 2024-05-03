import React, { useState, useRef } from "react";
import s from "./pressAndHoldCTA.module.css";

const PressAndHoldCTA = ({
  onBeginPress,
  onEndPress,
  onRelease,
  pressDuration = 2000,
}: {
  onBeginPress?: () => void;
  onEndPress?: () => void;
  onRelease?: () => void;
  pressDuration?: number;
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  let initialTimestamp: number;

  const handlePress = () => {
    initialTimestamp = Date.now();
    setIsPressed(true);
    onBeginPress && onBeginPress();
    timeout.current = setTimeout(() => {
      setIsPressed(false);
      onEndPress && onEndPress();
    }, pressDuration);
  };

  const handleRelease = () => {
    const timeRemaining = Date.now() - initialTimestamp;
    if (timeRemaining > 1000 && timeout.current) {
      clearTimeout(timeout.current);
      setIsPressed(false);
      onEndPress && onEndPress();
    } else {
      onRelease && onRelease();
      setIsPressed(false);
    }
  };

  return (
    <button
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      onTouchCancel={handleRelease}
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
    </button>
  );
};

export default PressAndHoldCTA;
