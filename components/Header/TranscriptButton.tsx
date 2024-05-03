import s from "./header.module.css";
import { useIrmaiStore } from "../ZustandStoreProvider/ZustandStoreProvider";

const TranscriptButton = () => {
  const { showTranscript, setShowTranscript } = useIrmaiStore((s) => s);

  return (
    <button
      className={s.transcriptButton}
      onClick={() => setShowTranscript(!showTranscript)}
    >
      <div className={s.transcriptButtonInner}>
        {showTranscript ? (
          <svg
            width="14"
            height="13"
            viewBox="0 0 14 13"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1.37573 1.11475L12.5746 12.3135" strokeWidth="1.5" />
            <path d="M12.5746 1.11475L1.37573 12.3135" strokeWidth="1.5" />
          </svg>
        ) : (
          <svg
            width="14"
            height="13"
            viewBox="0 0 24 15"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.937836 1.23926C1.7846 1.23926 16.5429 1.23926 23.8162 1.23926"
              strokeWidth="2"
            />
            <path
              d="M0.937836 7.23926C1.7846 7.23926 16.5429 7.23926 23.8162 7.23926"
              strokeWidth="2"
            />
            <path
              d="M0.937836 13.2393C1.7846 13.2393 16.5429 13.2393 23.8162 13.2393"
              strokeWidth="2"
            />
          </svg>
        )}
      </div>
    </button>
  );
};

export default TranscriptButton;
