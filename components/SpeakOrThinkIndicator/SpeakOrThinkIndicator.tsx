import { motion } from "motion/react";

const SpeakOrThinkIndicator = ({
  role,
  isSpeaking,
  isThinking,
  isLastMessage,
}: {
  role: string;
  isSpeaking: boolean;
  isThinking: boolean;
  isLastMessage: boolean;
}) => {
  if (role !== "assistant" || !isLastMessage) return null;
  return (
    <motion.span
      initial={{
        opacity: 0,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: isThinking || isSpeaking ? [0, 1] : 0,
        filter:
          isThinking || isSpeaking ? ["blur(6px)", "blur(0)"] : "blur(10px)",
      }}
      transition={{
        opacity: {
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeOut",
        },
        filter: {
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeOut",
        },
      }}
    >
      {isThinking && " is thinking..."}
      {isSpeaking && " is speaking..."}
    </motion.span>
  );
};

export default SpeakOrThinkIndicator;
