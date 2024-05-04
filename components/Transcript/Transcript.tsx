import { memo, useEffect, useRef } from "react";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import { TimeKeeper, FocusBlock } from "./Transcript.utils";

import useScrollToTop from "@/hooks/use-scroll-to-top";
import useTranscript from "@/hooks/use-transcript";

import s from "./transcript.module.css";

const Transcript = ({ chatProps }: any) => {
  const {
    focus,
    firstQuestion,
    showTranscript,
    setShowTranscript,
    selectedCards,
    conclusion,
  } = useIrmaiStore((s) => s);
  const transcriptInnerElem = useRef<HTMLDivElement | null>(null);
  const { messages } = chatProps;
  const transcript = useTranscript(messages);

  useScrollToTop(transcriptInnerElem);

  useEffect(() => {
    setShowTranscript(false);
  }, []);

  // TODO: refactor remaining transcript blocks

  return (
    <div className={`${s.transcript}`} data-show={showTranscript}>
      <main className={s.transcriptInner} ref={transcriptInnerElem}>
        <TimeKeeper />
        <FocusBlock focus={focus} />
        {selectedCards.length > 0 && (
          <article className={s.transcriptBlock}>
            <header className={s.transcriptHeader}>Your Cards</header>
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
            <header className={s.transcriptHeader}>Starting Question</header>
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
                    <span>{item.role === "assistant" ? "irmai" : "you"}</span>
                    <p>{item.content}</p>
                  </li>
                ))}

              {conclusion.length > 0 && (
                <li className={s.transcriptItemAi}>
                  <span>[end of conversation]</span>
                </li>
              )}
            </ul>
          </article>
        )}
        {conclusion.length > 0 && (
          <article className={s.transcriptBlock}>
            <header className={s.transcriptHeader}>Conclusion</header>
            <div className={s.transcriptHighlight}>
              <p>
                <em>{conclusion}</em>
              </p>
            </div>
          </article>
        )}

        {/* TODO: figure out outro actions */}
        {conclusion.length > 0 && (
          <article className={s.transcriptBlock}>
            <header className={s.transcriptHeader}>
              [ADD OUTRO ACTIONS HERE]
            </header>
          </article>
        )}
      </main>
    </div>
  );
};

export default memo(Transcript);
