import React, { useState } from "react";

import s from "@/components/PressAndHoldCTA/pressAndHoldCTA.module.css";

const PressCTA = ({
  onPress,
  label = "Press",
  labelIsOutside = false,
  icon = false,
}: {
  onPress?: () => void;
  label?: string;
  labelIsOutside?: boolean;
  icon?: React.ReactNode | null;
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
        {!labelIsOutside && <span className={s.circleCopy}>{label}</span>}
        {labelIsOutside && icon && <div className={s.icon}>{icon}</div>}
      </div>
      {labelIsOutside && <span className={s.copy}>{label}</span>}
    </button>
  );
};

export default PressCTA;
