import { memo, useState, useEffect, useRef } from "react";

import { dateDDMMYYYY, timeHHMM, filteredTranscript } from "@/utils";
import { cirka, poppins } from "@/utils/fonts";
import { IChatProps, ChatMessage } from "@/utils/shared-types";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import s from "./transcript.module.css";

const Transcript = ({ chatProps }: { chatProps: IChatProps }) => {
  const {
    focus,
    firstQuestion,
    showTranscript,
    setShowTranscript,
    selectedCards,
    conclusion,
  } = useIrmaiStore((s) => s);
  const [transcript, setTranscript] = useState<ChatMessage[]>([]);
  const transcriptInnerElem = useRef<HTMLDivElement | null>(null);

  const { messages } = chatProps;

  useEffect(() => {
    if (messages && messages.length > 1) {
      setTranscript(filteredTranscript(messages));
    }
  }, [messages]);

  useEffect(() => {
    setShowTranscript(false);
    transcriptInnerElem.current?.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`${poppins.className} ${s.transcript}`}
      data-show={showTranscript}
    >
      <main className={s.transcriptInner} ref={transcriptInnerElem}>
        <div className={s.timeKeeper}>
          <span className={s.timeDate}>{dateDDMMYYYY()}</span>
          <span className={s.timeTime}>{timeHHMM()}</span>
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
