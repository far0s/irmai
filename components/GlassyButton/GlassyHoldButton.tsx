import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import s from "./glassyButton.module.css";

const GlassyHoldButton = ({
  onBeginPress,
  onEndPress,
  onRelease,
  pressDuration = 2000,
  children,
}: {
  onBeginPress?: () => void;
  onEndPress?: () => void;
  onRelease?: () => void;
  pressDuration?: number;
  children: React.ReactNode;
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
    <div className={s.btnWrapper}>
      <button
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        onTouchCancel={handleRelease}
        data-is-pressed={isPressed}
        role="button"
        className={s.btn}
      >
        <span>{children}</span>
      </button>
      <div className={s.btnShadow} />
    </div>
  );
};

export default GlassyHoldButton;
