import s from "./transcript.module.css";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

const Transcript = () => {
  const { showTranscript } = useIrmaiStore((s) => s);

  return (
    <div className={s.transcript} data-show={showTranscript}>
      <main className={s.transcriptInner}>
        <div className={s.timeKeeper}>
          <span className={s.timeDate}>10/23/2024</span>
          <span className={s.timeTime}>16:34</span>
        </div>
        <article className={s.transcriptBlock}>
          <header className={s.transcriptHeader}>Focus</header>
          <div className={s.transcriptHighlight}>
            <p>Romantic Partner</p>
          </div>
        </article>
        <article className={s.transcriptBlock}>
          <header className={s.transcriptHeader}>Your Cards</header>
          <div className={s.transcriptCards}>
            <div className={s.transcriptCard}>
              <div className={s.transcriptCardPicture}></div>
              <p className={s.transcriptCardTitle}>The Fool</p>
            </div>
            <div className={s.transcriptCard}>
              <div className={s.transcriptCardPicture}></div>
              <p className={s.transcriptCardTitle}>The High Priestess</p>
            </div>
            <div className={s.transcriptCard}>
              <div className={s.transcriptCardPicture}></div>
              <p className={s.transcriptCardTitle}>The Tower</p>
            </div>
          </div>
        </article>
        <article className={s.transcriptBlock}>
          <header className={s.transcriptHeader}>Starting Question</header>
          <div className={s.transcriptHighlight}>
            <p>How can I strengthen the connection with my romantic partner?</p>
          </div>
        </article>
        <article className={s.transcriptBlock}>
          <header className={s.transcriptHeader}>Conclusion</header>
          <div className={s.transcriptHighlight}>
            <p>
              {" "}
              The Fool suggested embracing new beginnings, while The High
              Priestess emphasized intuition and inner wisdom. However, The
              Tower warned of potential upheaval, urging us to prepare for
              transformative change.
            </p>
          </div>
        </article>

        <article className={s.transcriptBlock}>Home</article>
      </main>
    </div>
  );
};

export default Transcript;
