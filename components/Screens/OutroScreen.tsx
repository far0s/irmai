import { useEffect, useState } from "react";

import { prepareConclusionPrompt } from "@/utils/prompts";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import { Screen } from "@/components/Stage/Stage";
import PressCTA from "@/components/PressCTA/PressCTA";
import { HighlightBlock } from "@/components/Transcript/Transcript.utils";

import s from "./screens.module.css";
import FadeInWrapper from "@/components/TransitionWrapper/TransitionWrapper";
import ShareImageCTA from "@/components/ShareImageCTA/ShareImageCTA";
import { CardsOverviewBlock } from "@/components/Transcript/Transcript.utils";
const DELAY_UNIT = 400;

const handleMessagesChange = (messages: any, setConclusion: any) => {
  if (messages?.length === 0) return;
  const lastMessage = messages?.[messages.length - 1];
  const lastMsgIsConclusion =
    lastMessage?.role === "assistant" &&
    lastMessage.content.startsWith("*CONCLUSION");
  if (lastMsgIsConclusion) {
    setConclusion(lastMessage.content.replace("*CONCLUSION", "").trim());
  }
};

const OutroScreen = ({
  isActive,
  assistantProps,
}: {
  isActive: boolean;
  assistantProps: any;
}) => {
  const { reset, setGlobalState, selectedCards, conclusion, setConclusion } =
    useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useState<null | "outro">(null);

  const { messages, append }: any = assistantProps;

  useEffect(() => {
    setPartToShow(isActive ? "outro" : null);
    isActive && !conclusion && prepareConclusionPrompt(append);
  }, [isActive]);

  useEffect(() => {
    handleMessagesChange(messages, setConclusion);
  }, [messages]);

  const handleReset = () => {
    reset();
    window.location.reload();
  };

  const handleBackToReading = () => {
    setPartToShow(null);
    setGlobalState("chat");
  };

  return (
    <Screen isActive={isActive}>
      <div className={s.wrapper}>
        <section
          className={s.screenPartWrapper}
          data-interactive={isActive && partToShow === "outro"}
        >
          <FadeInWrapper
            show={partToShow === "outro" && conclusion.length === 0}
            delay={DELAY_UNIT}
          >
            <HighlightBlock header="Conclusion">
              <p>
                <em>Summarizing your reading...</em>
              </p>
            </HighlightBlock>
          </FadeInWrapper>
        </section>
        <section
          className={s.screenPartWrapper}
          data-interactive={isActive && partToShow === "outro"}
        >
          <FadeInWrapper
            show={partToShow === "outro" && conclusion.length > 0}
            delay={DELAY_UNIT * 2}
          >
            <HighlightBlock header="Conclusion">
              <p>
                <em>
                  {conclusion.startsWith(": ")
                    ? conclusion.slice(2)
                    : conclusion}
                </em>
              </p>
            </HighlightBlock>
          </FadeInWrapper>
          <FadeInWrapper
            className={s.copy}
            show={partToShow === "outro" && conclusion.length > 0}
            delay={3 * DELAY_UNIT}
          >
            {selectedCards.length > 0 && (
              <CardsOverviewBlock cards={selectedCards} />
            )}
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "outro" && conclusion.length > 0}
            delay={DELAY_UNIT * 3}
          >
            <div className={s.ctaRow}>
              <ShareImageCTA />
            </div>
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "outro" && conclusion.length > 0}
            delay={DELAY_UNIT * 4}
          >
            <div className={s.ctaRow}>
              <PressCTA
                label="Back to my reading"
                onPress={handleBackToReading}
              />
              <PressCTA label="New Reading" onPress={handleReset} />
            </div>
          </FadeInWrapper>
        </section>
      </div>

      <footer className={s.footer}></footer>
    </Screen>
  );
};

export default OutroScreen;
