import { memo, useState, useEffect } from "react";
import s from "./transcript.module.css";
import { cirka, poppins } from "@/utils/fonts";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

const Transcript = () => {
  const {
    focus,
    firstQuestion,
    showTranscript,
    selectedCards,
    transcript,
    conclusion,
  } = useIrmaiStore((s) => s);
  const [transcriptWithoutFirstQuestion, setTranscriptWithoutFirstQuestion] =
    useState<any[]>([]);

  useEffect(() => {
    if (transcript.length > 1) {
      setTranscriptWithoutFirstQuestion(transcript.slice(1));
    }
  }, [transcript]);

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
              {transcriptWithoutFirstQuestion.length > 0 &&
                transcriptWithoutFirstQuestion.map((item) => (
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
                    <p>{item.content}</p>
                  </li>
                ))}

              {conclusion.length > 0 && (
                <li className={s.transcriptItemAi}>
                  <span className={cirka.className}>[end of conversation]</span>
                </li>
              )}
            </ul>
          </article>
        )}
        {conclusion.length > 0 && (
          <article className={s.transcriptBlock}>
            <header className={`${cirka.className} ${s.transcriptHeader}`}>
              Conclusion
            </header>
            <div className={s.transcriptHighlight}>
              <p>
                <em>{conclusion}</em>
              </p>
            </div>
          </article>
        )}

        {conclusion.length > 0 && (
          <article className={s.transcriptBlock}>
            <header className={`${cirka.className} ${s.transcriptHeader}`}>
              [ADD OUTRO ACTIONS HERE]
            </header>
          </article>
        )}
      </main>
    </div>
  );
};

export default memo(Transcript);
