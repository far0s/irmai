import { motion } from "motion/react";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import GlassyButton from "@/components/GlassyButton/GlassyButton";

const MuteToggle = () => {
  // Use separate selectors instead of returning an object
  const isMuted = useIrmaiStore((state) => state.isMuted);
  const setIsMuted = useIrmaiStore((state) => state.setIsMuted);
  const globalState = useIrmaiStore((state) => state.globalState);
  const firstQuestion = useIrmaiStore((state) => state.firstQuestion);

  const isNotSplash = globalState !== "splash";
  const show = firstQuestion.length > 0;

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

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
      <GlassyButton onClick={toggleMute} variant="small-square">
        {isMuted ? (
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
              d="M11 5 6 9H2v6h4l5 4V5Z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="m23 9-6 6"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="m17 9 6 6"
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
              d="M11 5 6 9H2v6h4l5 4V5Z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
            />
          </svg>
        )}
      </GlassyButton>
    </motion.div>
  );
};

export default MuteToggle;
