import { useEffect, useState } from "react";

import { withoutTrailingPeriod } from "@/utils";
import { prepareFirstPrompt } from "@/utils/prompts";
import { IChatProps } from "@/utils/shared-types";
import convertSpeechToText from "@/utils/speech-to-text";
import convertTextToSpeech from "@/utils/text-to-speech";

import useRecorder from "@/hooks/use-recorder";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import { Screen } from "@/components/Stage/Stage";
import PressCTA from "@/components/PressCTA/PressCTA";
import PressAndHoldCTA from "@/components/PressAndHoldCTA/PressAndHoldCTA";
import FadeInWrapper from "@/components/FadeInWrapper/FadeInWrapper";

import s from "./screens.module.css";
import { TextBlock } from "../Transcript/Transcript.utils";
import { start } from "repl";

type TPartToShow =
  | null
  | "idle"
  | "recording"
  | "thinking"
  | "speaking"
  | "recording";

const QuestionScreen = ({
  isActive,
  chatProps,
}: {
  isActive: boolean;
  chatProps: IChatProps;
}) => {
  const {
    setGlobalState,
    focus,
    selectedCards,
    setIsSpeaking,
    setIsListening,
    setIsThinking,
    firstQuestion,
    setFirstQuestion,
  } = useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useState<TPartToShow>(null);

  const { messages, append }: IChatProps = chatProps;

  const {
    startRecording,
    stopRecording,
    resetRecording,
    audioURL,
    isRecording,
    audioFile,
  } = useRecorder();

  useEffect(() => {
    setPartToShow(isActive ? "idle" : null);
  }, [isActive]);

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
          if (!firstQuestion) setFirstQuestion(withoutTrailingPeriod(res.text));
          resetRecording?.();
          append?.({
            content: !firstQuestion
              ? prepareFirstPrompt({
                  focus,
                  firstQuestion: withoutTrailingPeriod(res.text),
                  cards: selectedCards,
                })
              : res.text,
            role: "user",
          } as any);
        },
      });
    }
  }, [audioURL, audioFile]);

  useEffect(() => {
    setIsListening(isRecording);
  }, [isRecording]);

  useEffect(() => {
    if (!isActive) return;
    if (focus?.length === 0) return;
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
        <section className={s.screenPartWrapper}>
          <FadeInWrapper show={partToShow === "idle"} delay={1000}>
            <TextBlock>
              <span>Question</span> Lorem ipsum dolor sit amet consectetur. Leo
              nisi odio aliquam cursus egestas. Augue venenatis tincidunt in
              volutpat. Nascetur amet auctor sem non fermentum. Velit sem
              ullamcorper tellus sed scelerisque ipsum elementum.
            </TextBlock>
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "idle" && messages && messages.length > 2}
            delay={1500}
          >
            <TextBlock>
              You can ask another question or we can end the conversation here.
              To ask a follow up press and hold. To end tap the close button on
              the top right.
              <PressCTA label="[End]" onPress={handleGoToOutro} />
            </TextBlock>
          </FadeInWrapper>
        </section>

        <section className={`${s.screenPartWrapper} ${s.tempAiFeedback}`}>
          <FadeInWrapper show={partToShow === "idle"} delay={100}>
            <div className={s.idle}>
              <p>"What is your question?"</p>
            </div>
          </FadeInWrapper>
          <FadeInWrapper show={partToShow === "recording"} delay={100}>
            <div className={s.recording}>
              <p>"Listening..."</p>
            </div>
          </FadeInWrapper>
          <FadeInWrapper show={partToShow === "thinking"} delay={100}>
            <div className={s.thinking}>
              <p>"Thinking..."</p>
            </div>
          </FadeInWrapper>
          <FadeInWrapper show={partToShow === "speaking"} delay={100}>
            <div className={s.speaking}>
              <p>"Speaking..."</p>
            </div>
          </FadeInWrapper>
        </section>

        <footer className={s.footer}>
          {(partToShow === "idle" || partToShow === "recording") && (
            <PressAndHoldCTA
              onBeginPress={handleStartRecording}
              onEndPress={handleStopRecording}
              onRelease={handleStopRecording}
              pressDuration={360000}
              idleChildren="Press & hold to record"
              activeChildren="Release to stop"
            />
          )}
        </footer>
      </div>
    </Screen>
  );
};

export default QuestionScreen;
