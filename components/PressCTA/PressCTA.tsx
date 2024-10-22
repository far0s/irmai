import React, { useState } from "react";
import { motion } from "framer-motion";

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

    window.setTimeout(() => {
      setIsPressed(false);
    }, 4000);
  };

  const handleRelease = () => {
    setIsPressed(false);
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
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 17 }}
    >
      <div className={s.circleWrapper}>
        {!labelIsOutside && <span className={s.circleCopy}>{label}</span>}
        {labelIsOutside && icon && <div className={s.icon}>{icon}</div>}
      </div>
      {labelIsOutside && <span className={s.copy}>{label}</span>}
    </motion.button>
  );
};

export default PressCTA;
