import { motion } from "motion/react";

import s from "./transitionWrapper.module.css";

const TransitionWrapper = ({
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
  return (
    <motion.div
      className={`${s.transitionWrapper} ${className || ""}`}
      data-show={show}
      initial={{
        opacity: 0,
        y: 32,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: show ? 1 : 0,
        y: show ? 0 : 32,
        filter: show ? "blur(0px)" : "blur(10px)",
      }}
      exit={{
        opacity: 0,
        y: 32,
        filter: "blur(10px)",
      }}
      transition={{
        delay: show ? delay / 1000 : 0,
        type: "spring",
        stiffness: 600,
        damping: 100,
      }}
    >
      {children}
    </motion.div>
  );
};

export default TransitionWrapper;
