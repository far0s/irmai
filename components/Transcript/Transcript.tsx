import { memo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Markdown from "markdown-to-jsx";

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

  const handleReset = () => {
    reset();
  };

  // TODO: refactor remaining transcript blocks

  return (
    <motion.div
      className={`${s.transcript}`}
      data-show={showTranscript}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: showTranscript ? 1 : 0,
      }}
      transition={{ type: "spring", duration: 0.4 }}
    >
      <motion.main
        className={s.transcriptInner}
        ref={transcriptInnerElem}
        initial={{
          y: "-2rem",
        }}
        animate={{
          y: showTranscript ? "0" : "-2rem",
        }}
        transition={{ type: "spring", duration: 0.4 }}
      >
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
                    <Markdown className={s.markdown}>{item.content}</Markdown>
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
              <PressCTA label="New Reading" onPress={handleReset} />
            </p>
          </article>
        )}
      </motion.main>
    </motion.div>
  );
};

export default memo(Transcript);
