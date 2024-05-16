import { memo, useEffect, useRef } from "react";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import {
  TimeKeeper,
  HighlightBlock,
  CardsOverviewBlock,
} from "./Transcript.utils";
import PressCTA from "@/components/PressCTA/PressCTA";

import useScrollToTop from "@/hooks/use-scroll-to-top";
import useTranscript from "@/hooks/use-transcript";

import s from "./transcript.module.css";

const Transcript = ({ assistantProps }: any) => {
  const {
    firstQuestion,
    showTranscript,
    setShowTranscript,
    selectedCards,
    conclusion,
    reset,
  } = useIrmaiStore((s) => s);
  const transcriptInnerElem = useRef<HTMLDivElement | null>(null);
  const { messages } = assistantProps;
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
        {firstQuestion.length > 0 && (
          <HighlightBlock header="Starting Question">
            <p>{firstQuestion}</p>
          </HighlightBlock>
        )}
        {selectedCards.length > 0 && (
          <CardsOverviewBlock cards={selectedCards} />
        )}
        {firstQuestion.length > 0 && (
          <article className={s.transcriptBlock}>
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
            <p>
              <PressCTA
                label="New Reading"
                onPress={() => {
                  reset();
                  window.location.reload();
                }}
              />
            </p>
          </article>
        )}
      </main>
    </div>
  );
};

export default memo(Transcript);
