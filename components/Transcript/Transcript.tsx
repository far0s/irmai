import s from "./transcript.module.css";
import { cirka, poppins } from "@/utils/fonts";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

const Transcript = () => {
  const { showTranscript } = useIrmaiStore((s) => s);

  return (
    <div
      className={`${poppins.className} ${s.transcript}`}
      data-show={showTranscript}
    >
      <main className={s.transcriptInner}>
        <div className={s.timeKeeper}>
          <span className={s.timeDate}>10/23/2024</span>
          <span className={s.timeTime}>16:34</span>
        </div>
        <article className={s.transcriptBlock}>
          <header className={`${cirka.className} ${s.transcriptHeader}`}>
            Focus
          </header>
          <div className={s.transcriptHighlight}>
            <p>Romantic Partner</p>
          </div>
        </article>
        <article className={s.transcriptBlock}>
          <header className={`${cirka.className} ${s.transcriptHeader}`}>
            Your Cards
          </header>
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
          <header className={`${cirka.className} ${s.transcriptHeader}`}>
            Starting Question
          </header>
          <div className={s.transcriptHighlight}>
            <p>How can I strengthen the connection with my romantic partner?</p>
          </div>
          <ul className={s.transcriptTranscript}>
            <li className={s.transcriptItemAi}>
              <span className={cirka.className}>irmai</span>
              <p>
                Lorem ipsum dolor sit amet consectetur. Eu feugiat tincidunt
                tortor posuere iaculis magna dolor dignissim. Cras nullam amet
                eleifend eros sed. In sed vitae est viverra leo urna. Vestibulum
                dui at placerat cras ornare. Ipsum augue a aliquam ut faucibus
                amet. Scelerisque luctus vitae dignissim ultrices pharetra eu.
              </p>
            </li>
            <li className={s.transcriptItemUser}>
              <span className={cirka.className}>You</span>
              <p>
                Lorem ipsum dolor sit amet consectetur. Eu feugiat tincidunt
                tortor posuere iaculis magna dolor dignissim. Cras nullam amet
                eleifend eros sed.
              </p>
            </li>
            <li className={s.transcriptItemAi}>
              <span className={cirka.className}>irmai</span>
              <p>
                Lorem ipsum dolor sit amet consectetur. Eu feugiat tincidunt
                tortor posuere iaculis magna dolor dignissim. Cras nullam amet
                eleifend eros sed. In sed vitae est viverra leo urna. Vestibulum
                dui at placerat cras ornare. Ipsum augue a aliquam ut faucibus
                amet. Scelerisque luctus vitae dignissim ultrices pharetra eu.
              </p>
            </li>
            <li className={s.transcriptItemUser}>
              <span className={cirka.className}>You</span>
              <p>
                Lorem ipsum dolor sit amet consectetur. Eu feugiat tincidunt
                tortor posuere iaculis magna dolor dignissim. Cras nullam amet
                eleifend eros sed.
              </p>
            </li>
          </ul>
        </article>
        <article className={s.transcriptBlock}>
          <header className={`${cirka.className} ${s.transcriptHeader}`}>
            Conclusion
          </header>
          <div className={s.transcriptHighlight}>
            <p>
              <em>
                The Fool suggested embracing new beginnings, while The High
                Priestess emphasized intuition and inner wisdom. However, The
                Tower warned of potential upheaval, urging us to prepare for
                transformative change.
              </em>
            </p>
          </div>
        </article>

        <article className={s.transcriptBlock}>
          <p>[ADD OUTRO ACTIONS HERE]</p>
        </article>
      </main>
    </div>
  );
};

export default Transcript;
