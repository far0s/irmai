import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import s from "./transcriptToggle.module.css";

const TranscriptToggle = () => {
  const { globalState, showTranscript, setShowTranscript, firstQuestion } =
    useIrmaiStore((s) => s);

  const isNotSplash = globalState !== "splash";
  const show = firstQuestion.length > 0;

  return (
    <button
      className={s.transcriptToggle}
      onClick={() => setShowTranscript(!showTranscript)}
      data-is-visible={show}
      data-is-not-splash-active={isNotSplash}
      aria-label="Hide or show the transcript"
    >
      <div className={s.transcriptToggleInner}>
        {showTranscript ? (
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M23 23 1 1" />
            <path d="M23 1 1 23" />
          </svg>
        ) : (
          <svg
            width="31"
            height="10"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M31 1H0" />
            <path d="M31 9H0" />
          </svg>
        )}
      </div>
    </button>
  );
};

export default TranscriptToggle;
