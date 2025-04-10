import { memo, useEffect, useRef } from "react";
import { motion } from "motion/react";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import TransitionWrapper from "@/components/TransitionWrapper/TransitionWrapper";

import useScrollToTop from "@/hooks/use-scroll-to-top";

import { DELAY_UNIT_SHORT as DELAY_UNIT } from "@/utils";

import s from "./transcript.module.css";

const Transcript = () => {
  const showTranscript = useIrmaiStore((s) => s.showTranscript);
  const setShowTranscript = useIrmaiStore((s) => s.setShowTranscript);

  const transcriptInnerElem = useRef<HTMLDivElement | null>(null);

  useScrollToTop(transcriptInnerElem, showTranscript);

  useEffect(() => {
    setShowTranscript(false);
  }, []);

  return (
    <motion.div
      className={`${s.transcript}`}
      data-show={showTranscript}
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: showTranscript ? 1 : 0,
        y: showTranscript ? 0 : 16,
      }}
      transition={{
        type: "spring",
        duration: 0.4,
        delay: showTranscript ? 0 : 0.4,
      }}
    >
      <motion.main
        className={s.transcriptInner}
        ref={transcriptInnerElem}
        initial={{
          y: -32,
        }}
        animate={{
          y: showTranscript ? 0 : -32,
        }}
        transition={{ type: "spring", duration: 0.4 }}
      >
        <TransitionWrapper show={showTranscript} delay={DELAY_UNIT}>
          <p>
            <span className={s.transcriptHeader}>✳︎ irmai </span>
            is an experiment exploring the intersection of spirituality and
            generative AI. For us, a tarot reading is a way to confront yourself
            with possibilities, and to reflect on your life and your choices. We
            wanted to see if we could create a similar experience with AI, and
            so we built irmai.
          </p>
          <br />
        </TransitionWrapper>

        <TransitionWrapper show={showTranscript} delay={2 * DELAY_UNIT}>
          <p>
            <span className={s.transcriptHeader}>✳︎ The team </span>
            irmai was imagined, designed, and built by{" "}
            <a
              className={s.link}
              target="_blank"
              rel="nofollow"
              href="https://www.instagram.com/hypercampina"
            >
              Sunniva Ottestad
            </a>
            ,{" "}
            <a
              className={s.link}
              target="_blank"
              rel="nofollow"
              href="https://ajmarshall.ca"
            >
              AJ Marshall
            </a>
            ,{" "}
            <a
              className={s.link}
              target="_blank"
              rel="nofollow"
              href="https://zeldacolombo.com"
            >
              Zelda Colombo
            </a>{" "}
            and{" "}
            <a
              className={s.link}
              target="_blank"
              rel="nofollow"
              href="https://seb.cat"
            >
              Seb Dancer-Michel
            </a>
            . We started talking about this project in November 2023, when
            OpenAI released the first ever preview of their voice capabilities.
          </p>
          <br />
        </TransitionWrapper>

        <TransitionWrapper show={showTranscript} delay={3 * DELAY_UNIT}>
          <p>
            <span className={s.transcriptHeader}>✳︎ Under the hood </span>
            irmai is a Next.js web application powered by gpt-4o-mini and its
            TTS equivalent, and hosted on Vercel. That's about it really! You
            can inspect the source code on{" "}
            <a
              className={s.link}
              target="_blank"
              rel="nofollow"
              href="https://github.com/far0s/irmai"
            >
              Github
            </a>
            .
          </p>
          <br />
        </TransitionWrapper>

        <TransitionWrapper show={showTranscript} delay={4 * DELAY_UNIT}>
          <p>
            <span className={s.transcriptHeader}>✳︎ Forever Free </span>
            irmai is free to use and will always be. We're paying for every cost
            associated with running this project ourselves, and although they're
            not huge, they're not zero either. If you want to support us and
            keep the lights on, you can{" "}
            <a
              className={s.link}
              target="_blank"
              rel="nofollow"
              href="https://buymeacoffee.com/far0s"
            >
              tip us here
            </a>{" "}
            ❤︎
          </p>
          <br />
        </TransitionWrapper>

        <TransitionWrapper show={showTranscript} delay={5 * DELAY_UNIT}>
          <p>
            <span className={s.transcriptHeader}>✳︎ Privacy </span>
            We don't store any data about you or your conversations with irmai.
            We don't use cookies or any tracking mechanisms. We don't even know
            how many people are using irmai right now. We're not interested in
            your data, we're interested in the conversation. Speaking of...
          </p>
          <br />
        </TransitionWrapper>

        <TransitionWrapper show={showTranscript} delay={6 * DELAY_UNIT}>
          <p>
            <span className={s.transcriptHeader}>✳︎ Talk to us! </span>
            AI is a rapidly evolving field, and we enjoy talking about any and
            every thing related to AI. If you have any feedback, questions, or
            just want to chat, reach us through our socials.
          </p>
          <br />
        </TransitionWrapper>

        <TransitionWrapper show={showTranscript} delay={10 * DELAY_UNIT}>
          <p
            style={{
              textAlign: "center",
              maxWidth: "100%",
              paddingBottom: "2rem",
              textWrap: "balance",
            }}
          >
            ✳︎ irmai © {new Date().getFullYear()} – where human imagination
            meets artificial hallucination ✳︎
          </p>
          <br />
        </TransitionWrapper>

        <a
          rel="me"
          href="https://mastodon.social/@far0s"
          style={{ display: "none", visibility: "hidden" }}
        >
          Mastodon
        </a>
      </motion.main>
    </motion.div>
  );
};

export default memo(Transcript);
