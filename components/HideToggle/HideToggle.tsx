import { motion } from "motion/react";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import GlassyButton from "@/components/GlassyButton/GlassyButton";

import s from "../TranscriptToggle/transcriptToggle.module.css";

const HideToggle = () => {
  const globalState = useIrmaiStore((s) => s.globalState);
  const firstQuestion = useIrmaiStore((s) => s.firstQuestion);
  const hideApp = useIrmaiStore((s) => s.hideApp);
  const setHideApp = useIrmaiStore((s) => s.setHideApp);

  const isNotSplash = globalState !== "splash";
  const show = firstQuestion.length > 0;

  return (
    <motion.div
      animate={{
        pointerEvents: isNotSplash && show ? "auto" : "none",
        opacity: isNotSplash && show ? 1 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
    >
      <GlassyButton onClick={() => setHideApp(!hideApp)} variant="small-square">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--cream)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      </GlassyButton>
    </motion.div>
  );
};

export default HideToggle;
