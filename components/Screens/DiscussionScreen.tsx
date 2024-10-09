import { useEffect, useState } from "react";

import { withoutTrailingPeriod } from "@/utils";
import { prepareFirstPrompt } from "@/utils/prompts";
import { ChatMessage } from "@/utils/shared-types";
import convertSpeechToText from "@/utils/speech-to-text";
import convertTextToSpeech from "@/utils/text-to-speech";

import useRecorder from "@/hooks/use-recorder";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import { Screen } from "@/components/Stage/Stage";
import PressCTA from "@/components/PressCTA/PressCTA";
import PressAndHoldCTA from "@/components/PressAndHoldCTA/PressAndHoldCTA";
import FadeInWrapper from "@/components/TransitionWrapper/TransitionWrapper";
import {
  TextBlock,
  HighlightBlock,
  CardsOverviewBlock,
} from "@/components/Transcript/Transcript.utils";

import s from "./screens.module.css";

type TPartToShow = null | "idle" | "recording" | "thinking" | "speaking";

const DiscussionScreen = ({
  isActive,
  assistantProps,
}: {
  isActive: boolean;
  assistantProps: any;
}) => {
  const {
    setGlobalState,
    selectedCards,
    setIsSpeaking,
    isSpeaking,
    setIsListening,
    setIsThinking,
    firstQuestion,
    setFirstQuestion,
  } = useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useState<TPartToShow>(null);

  const { messages, append }: any = assistantProps;

  const {
    startRecording,
    stopRecording,
    resetRecording,
    audioURL,
    isRecording,
    audioFile,
  } = useRecorder();

  const checkIfIrmaiHasAlreadyAnswered = () => {
    const msgs: ChatMessage[] | undefined = messages?.filter(
      (message: ChatMessage) => message.role === "assistant"
    );

    return (msgs && msgs.length > 0) || false;
  };

  useEffect(() => {
    if (!isActive) return;
    const hasAlreadyAnswered = checkIfIrmaiHasAlreadyAnswered();
    setPartToShow(hasAlreadyAnswered ? "idle" : "thinking");
    !hasAlreadyAnswered && handleSendFirstQuestion();
  }, [isActive]);

  const handleSendFirstQuestion = () => {
    if (!firstQuestion) return;
    if (!selectedCards || selectedCards.length === 0) return;
    if (!append) return;

    setIsThinking(true);

    append({
      content: prepareFirstPrompt({
        firstQuestion: firstQuestion,
        cards: selectedCards,
      }),
      role: "user",
    } as any);
  };

  const handleStartRecording = () => {
    setPartToShow("recording");
    startRecording();
  };

  const handleStopRecording = () => {
    setPartToShow("thinking");
    stopRecording();
  };

  useEffect(() => {
    if (isActive && audioURL && audioFile) {
      setPartToShow("thinking");
      setIsThinking(true);
      // TODO: refactor the callbacks
      convertSpeechToText({
        audioFile: audioFile,
        errorCallback: (error) => {
          window.alert(error);
          setPartToShow("idle");
        },
        successCallback: (res) => {
          if (!res.text) {
            window.alert("Sorry, I didn't catch that. Can you repeat?");
            setPartToShow("idle");
            return;
          }
          resetRecording?.();
          append?.({
            content: !firstQuestion
              ? prepareFirstPrompt({
                  firstQuestion: withoutTrailingPeriod(res.text),
                  cards: selectedCards,
                })
              : res.text,
            role: "user",
          } as any);
          if (!firstQuestion) setFirstQuestion(withoutTrailingPeriod(res.text));
        },
      });
    }
  }, [audioURL, audioFile]);

  useEffect(() => {
    setIsListening(isRecording);
  }, [isRecording]);

  useEffect(() => {
    if (!isActive) return;
    if (isSpeaking) return;
    if (firstQuestion?.length === 0) return;
    if (messages?.length === 0) return;

    const lastMessage = messages?.[messages.length - 1];

    const timer = setTimeout(() => {
      if (lastMessage?.role === "assistant") {
        // TODO: refactor the callbacks
        convertTextToSpeech({
          mediaDevices: navigator.mediaDevices,
          message: lastMessage,
          startSpeakCallback: () => {
            setIsThinking(false);
            setIsSpeaking(true);
            setPartToShow("speaking");
          },
          endSpeakCallback: () => {
            setIsSpeaking(false);
            setPartToShow("idle");
          },
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [messages]);

  const handleGoToOutro = () => {
    setGlobalState("outro");
    setIsSpeaking(false);
    setIsListening(false);
    resetRecording?.();
  };

  return (
    <Screen isActive={isActive}>
      <div className={s.wrapper}>
        <section
          className={s.screenPartWrapper}
          data-interactive={partToShow === "idle"}
        >
          <FadeInWrapper
            show={partToShow === "idle" && firstQuestion.length > 0}
            delay={1000}
            variant="fade"
          >
            <HighlightBlock header="Question" expandable>
              <p>{firstQuestion}</p>
            </HighlightBlock>
          </FadeInWrapper>
          <FadeInWrapper
            className={s.copy}
            show={partToShow === "idle"}
            delay={1500}
            variant="fade"
          >
            <CardsOverviewBlock cards={selectedCards} expandable />
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "idle" && messages && messages.length > 1}
            delay={1500}
            variant="fade"
          >
            <TextBlock>
              You can ask another question or we can end the conversation here.
              To ask a follow up press and hold. To end tap the close button on
              the top right.
            </TextBlock>
          </FadeInWrapper>
        </section>

        <section className={`${s.screenPartWrapper} ${s.tempAiFeedback}`}>
          <FadeInWrapper
            show={partToShow === "idle"}
            delay={100}
            variant="fade"
          >
            <div className={s.idle}>
              <p>"What is your question?"</p>
            </div>
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "recording"}
            delay={100}
            variant="fade"
          >
            <div className={s.recording}>
              <p>"Listening..."</p>
            </div>
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "thinking"}
            delay={100}
            variant="fade"
          >
            <div className={s.thinking}>
              <p>"Thinking..."</p>
            </div>
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "speaking"}
            delay={100}
            variant="fade"
          >
            <div className={s.speaking}>
              <p>"Speaking..."</p>
            </div>
          </FadeInWrapper>
        </section>

        <footer className={s.footer}>
          {(partToShow === "idle" || partToShow === "recording") && (
            <PressAndHoldCTA
              onBeginPress={() => handleStartRecording()}
              onEndPress={() => handleStopRecording()}
              onRelease={() => handleStopRecording()}
              pressDuration={360000}
              idleChildren={
                messages && messages.length > 1
                  ? "Record a new question"
                  : "Press & hold to record"
              }
              activeChildren="Release to stop"
            />
          )}
          {partToShow === "idle" && messages && messages.length > 1 && (
            <PressCTA
              label="Or end the reading"
              onPress={handleGoToOutro}
              icon={
                <svg
                  width="14"
                  height="13"
                  viewBox="0 0 14 13"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.37573 1.11475L12.5746 12.3135"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12.5746 1.11475L1.37573 12.3135"
                    strokeWidth="1.5"
                  />
                </svg>
              }
              labelIsOutside
            />
          )}
        </footer>
      </div>
    </Screen>
  );
};

export default DiscussionScreen;
