import s from "./transcript.module.css";
import { cirka, poppins } from "@/utils/fonts";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

const Transcript = () => {
  const { focus, firstQuestion, showTranscript, selectedCards, transcript } =
    useIrmaiStore((s) => s);

  const date = new Date().toLocaleDateString("fr-FR", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const time = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`${poppins.className} ${s.transcript}`}
      data-show={showTranscript}
    >
      <main className={s.transcriptInner}>
        <div className={s.timeKeeper}>
          <span className={s.timeDate}>{date}</span>
          <span className={s.timeTime}>{time}</span>
        </div>
        <article className={s.transcriptBlock}>
          <header className={`${cirka.className} ${s.transcriptHeader}`}>
            Focus
          </header>
          {focus?.length > 0 && (
            <div className={s.transcriptHighlight}>
              <p>{focus}</p>
            </div>
          )}
        </article>
        {selectedCards.length > 0 && (
          <article className={s.transcriptBlock}>
            <header className={`${cirka.className} ${s.transcriptHeader}`}>
              Your Cards
            </header>
            <div className={s.transcriptCards}>
              {selectedCards.map((card) => (
                <div key={card.name_short} className={s.transcriptCard}>
                  <div className={s.transcriptCardPicture}></div>
                  <p className={s.transcriptCardTitle}>{card.name}</p>
                </div>
              ))}
            </div>
          </article>
        )}
        {firstQuestion.length > 0 && (
          <article className={s.transcriptBlock}>
            <header className={`${cirka.className} ${s.transcriptHeader}`}>
              Starting Question
            </header>
            <div className={s.transcriptHighlight}>
              <p>{firstQuestion}</p>
            </div>
            <ul className={s.transcriptTranscript}>
              {transcript.length > 0 &&
                transcript.map((item) => (
                  <li
                    key={item.id}
                    className={
                      item.role === "assistant"
                        ? s.transcriptItemAi
                        : s.transcriptItemUser
                    }
                  >
                    <span className={cirka.className}>
                      {item.role === "assistant" ? "irmai" : "you"}
                    </span>
                    <p>
                      Lorem ipsum dolor sit amet consectetur. Eu feugiat
                      tincidunt tortor posuere iaculis magna dolor dignissim.
                      Cras nullam amet eleifend eros sed. In sed vitae est
                      viverra leo urna. Vestibulum dui at placerat cras ornare.
                      Ipsum augue a aliquam ut faucibus amet. Scelerisque luctus
                      vitae dignissim ultrices pharetra eu.
                    </p>
                  </li>
                ))}
            </ul>
          </article>
        )}
        {/* <article className={s.transcriptBlock}>
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
        </article> */}
      </main>
    </div>
  );
};

export default Transcript;
