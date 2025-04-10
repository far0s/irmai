import { motion } from "motion/react";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import GlassyButton from "@/components/GlassyButton/GlassyButton";

const TranscriptToggle = () => {
  const globalState = useIrmaiStore((s) => s.globalState);
  const showTranscript = useIrmaiStore((s) => s.showTranscript);
  const setShowTranscript = useIrmaiStore((s) => s.setShowTranscript);
  const firstQuestion = useIrmaiStore((s) => s.firstQuestion);

  const isNotSplash = globalState !== "splash";
  const show = firstQuestion.length > 0;

  return (
    <motion.div
      style={{
        marginTop: "-0.5rem",
      }}
      animate={{
        pointerEvents: isNotSplash && show ? "auto" : "none",
        opacity: isNotSplash && show ? 1 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
    >
      <GlassyButton
        onClick={() => setShowTranscript(!showTranscript)}
        variant="small-square"
      >
        {showTranscript ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M18 6 6 18"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="m6 6 12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M3 12h18"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M3 6h18"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M3 18h18"
            />
          </svg>
        )}
      </GlassyButton>
    </motion.div>
  );
};

export default TranscriptToggle;
