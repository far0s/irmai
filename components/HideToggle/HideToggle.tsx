import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import s from "../TranscriptToggle/transcriptToggle.module.css";

const HideToggle = () => {
  const { globalState, firstQuestion, hideApp, setHideApp } = useIrmaiStore(
    (s) => s
  );

  const isNotSplash = globalState !== "splash";
  const show = firstQuestion.length > 0;

  return (
    <button
      className={s.transcriptToggle}
      onClick={() => setHideApp(!hideApp)}
      data-is-visible={show}
      data-is-not-splash-active={isNotSplash}
      aria-label="Hide or show the app"
    >
      <div className={s.transcriptToggleInner}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      </div>
    </button>
  );
};

export default HideToggle;