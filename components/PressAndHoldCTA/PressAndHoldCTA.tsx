import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

import s from "./pressAndHoldCTA.module.css";

const PressAndHoldCTA = ({
  onBeginPress,
  onEndPress,
  onRelease,
  pressDuration = 2000,
  idleChildren,
  activeChildren,
}: {
  onBeginPress?: () => void;
  onEndPress?: () => void;
  onRelease?: () => void;
  pressDuration?: number;
  idleChildren?: React.ReactNode;
  activeChildren?: React.ReactNode;
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
    <motion.button
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
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 17 }}
    >
      <div className={s.circleWrapper}>
        <span className={s.circleGlow}></span>
      </div>
      <span className={s.copy}>
        {idleChildren || (
          <>
            Press and
            <br />
            hold
          </>
        )}
      </span>
      <span className={s.copyWhilePress}>
        {activeChildren || "Keep holding"}
      </span>
    </motion.button>
  );
};

export default PressAndHoldCTA;
