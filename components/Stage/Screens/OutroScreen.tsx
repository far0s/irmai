import { useEffect, useState } from "react";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import { Screen } from "../Stage.utils";
import s from "./screens.module.css";
import { cirka } from "@/utils/fonts";
import PressCTA from "@/components/PressCTA/PressCTA";
import { IChatProps } from "@/utils/shared-types";

const OutroScreen = ({
  isActive,
  id,
  chatProps,
}: {
  isActive: boolean;
  id: string;
  chatProps: IChatProps;
}) => {
  const { setGlobalState, setShowTranscript, conclusion, setConclusion } =
    useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useState<
    null | "start" | "copy2" | "copy3" | "end"
  >(null);

  const { input, messages, handleInputChange, handleSubmit, append } =
    chatProps;

  useEffect(() => {
    if (!isActive) return;
    setPartToShow("start");
    !conclusion && askForConclusion();
  }, [isActive]);

  // on load, ask AI for a conclusion to the reading, based on the previous messages
  const askForConclusion = () => {
    append({
      role: "user",
      content:
        "Provide a conclusion to the reading (max 50 words) that summarizes the conversation. Don't mention the cards. Precede your answer with `*CONCLUSION`",
    } as any);
  };

  useEffect(() => {
    if (messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage.role === "user" &&
      lastMessage.content.startsWith("*CONCLUSION")
    ) {
      const conclusion = lastMessage.content
        .replace("*CONCLUSION: ", "")
        .trim();
      console.log("conclusion", conclusion);

      setConclusion(conclusion);
    }
  }, [messages]);

  return (
    <Screen id={id} isActive={isActive}>
      <div className={s.wrapper} data-show={partToShow}>
        {conclusion.length > 0 && (
          <div className={s.copy}>
            <p>
              <span className={`${cirka.className}`}>Conclusion</span>
              {conclusion}
            </p>
          </div>
        )}
      </div>

      <PressCTA
        label="Show transcript"
        onPress={() => setShowTranscript(true)}
      />
    </Screen>
  );
};

export default OutroScreen;
