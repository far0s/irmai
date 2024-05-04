import React, { useState } from "react";

import s from "@/components/PressAndHoldCTA/pressAndHoldCTA.module.css";

const PressCTA = ({
  onPress,
  label = "Press",
}: {
  onPress?: () => void;
  label?: string;
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    onPress && onPress();
    setIsPressed(true);
  };

  const handleRelease = () => {
    setIsPressed(false);
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
    >
      <div className={s.circleWrapper}>
        <span className={s.circleCopy}>{label}</span>
      </div>
    </button>
  );
};

export default PressCTA;
