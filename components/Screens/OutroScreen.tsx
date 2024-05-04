import { useEffect, useState } from "react";

import { prepareConclusionPrompt } from "@/utils/prompts";
import { IChatProps } from "@/utils/shared-types";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import { Screen } from "@/components/Stage/Stage";
import PressCTA from "@/components/PressCTA/PressCTA";

import s from "./screens.module.css";

const handleActiveChange = (
  conclusion: any,
  append: any,
  setPartToShow: any,
  prepareConclusionPrompt: any
) => {
  setPartToShow("start");
  !conclusion && prepareConclusionPrompt(append);
};

const handleMessagesChange = (messages: any, setConclusion: any) => {
  if (messages?.length === 0) return;
  const lastMessage = messages?.[messages.length - 1];
  const lastMsgIsConclusion =
    lastMessage?.role === "assistant" &&
    lastMessage.content.startsWith("*CONCLUSION");
  if (lastMsgIsConclusion) {
    setConclusion(lastMessage.content.replace("*CONCLUSION: ", "").trim());
  }
};

const OutroScreen = ({
  isActive,
  id,
  chatProps,
}: {
  isActive: boolean;
  id: string;
  chatProps: IChatProps;
}) => {
  const { reset, setShowTranscript, conclusion, setConclusion } = useIrmaiStore(
    (s) => s
  );
  const [partToShow, setPartToShow] = useState<null | "start">(null);

  const { messages, append }: IChatProps = chatProps;

  useEffect(() => {
    isActive &&
      handleActiveChange(
        conclusion,
        append,
        setPartToShow,
        prepareConclusionPrompt
      );
  }, [isActive]);

  useEffect(() => {
    handleMessagesChange(messages, setConclusion);
  }, [messages]);

  return (
    <Screen id={id} isActive={isActive}>
      <div className={s.wrapper} data-show={partToShow}>
        {conclusion.length > 0 && (
          <article
            className={s.transcriptBlock}
            data-show={partToShow === "start"}
          >
            <header className={s.transcriptHeader}>Conclusion</header>
            <div className={s.transcriptHighlight}>
              <p>
                <em>{conclusion}</em>
              </p>
            </div>
          </article>
        )}
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
