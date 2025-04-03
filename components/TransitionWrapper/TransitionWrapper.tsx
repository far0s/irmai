import { memo } from "react";
import { motion, useReducedMotion } from "motion/react";

import s from "./transitionWrapper.module.css";

const TransitionWrapper = memo(
  ({
    show = false,
    delay = 0,
    className,
    children,
  }: {
    show?: boolean;
    delay?: number;
    className?: string;
    children: React.ReactNode;
  }) => {
    // Respect user's reduce motion settings
    const prefersReducedMotion = useReducedMotion();

    // Simpler animation for reduced motion
    const animation = prefersReducedMotion
      ? {
          opacity: show ? 1 : 0,
        }
      : {
          opacity: show ? 1 : 0,
          y: show ? 0 : 32,
          filter: show ? "blur(0px)" : "blur(10px)",
        };

    return (
      <motion.div
        className={`${s.transitionWrapper} ${className || ""}`}
        data-show={show}
        initial={animation}
        animate={animation}
        exit={animation}
        transition={{
          delay: show ? delay / 1000 : 0,
          duration: prefersReducedMotion ? 0.1 : 0.3,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    );
  }
);

TransitionWrapper.displayName = "TransitionWrapper";

export default TransitionWrapper;
