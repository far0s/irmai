import { useEffect, useState } from "react";
import { UseAssistantHelpers } from "ai/react";

import { prepareConclusionPrompt } from "@/utils/prompts";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import { Screen } from "@/components/Stage/Stage";
import PressCTA from "@/components/PressCTA/PressCTA";
import { HighlightBlock } from "@/components/Transcript/Transcript.utils";

import s from "./screens.module.css";
import FadeInWrapper from "../TransitionWrapper/TransitionWrapper";

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
  assistantProps: UseAssistantHelpers;
}) => {
  const { reset, setShowTranscript, conclusion, setConclusion } = useIrmaiStore(
    (s) => s
  );
  const [partToShow, setPartToShow] = useState<null | "outro">(null);

  const { messages, append }: UseAssistantHelpers = assistantProps;

  useEffect(() => {
    setPartToShow(isActive ? "outro" : null);
    isActive && !conclusion && prepareConclusionPrompt(append);
  }, [isActive]);

  useEffect(() => {
    handleMessagesChange(messages, setConclusion);
  }, [messages]);

  return (
    <Screen isActive={isActive}>
      <div className={s.wrapper}>
        <section
          className={s.screenPartWrapper}
          data-interactive={partToShow === "outro"}
        >
          <FadeInWrapper
            show={partToShow === "outro" && conclusion.length > 0}
            delay={1000}
            variant="fade"
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
        </section>
      </div>

      <footer className={s.footer}>
        <PressCTA
          label="Show transcript"
          onPress={() => setShowTranscript(true)}
        />
        <PressCTA
          label="New Reading"
          onPress={() => {
            reset();
            window.location.reload();
          }}
        />
      </footer>
    </Screen>
  );
};

export default OutroScreen;
