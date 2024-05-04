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

import s from "./screens.module.css";

type TPartToShow = null | "start" | "recording" | "thinking" | "result";

const QuestionScreen = ({
  isActive,
  id,
  chatProps,
}: {
  isActive: boolean;
  id: string;
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
    isActive && setPartToShow("start");

    return () => {
      setPartToShow("start");
    };
  }, [isActive]);

  const handlePress = () => {
    setPartToShow("recording");
    startRecording();
  };

  const handleStopRecording = () => {
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
          setPartToShow("start");
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
    // start a timer for 2 seconds
    // when new messages come in,
    // check if the last message was from the assistant
    // if so, restart the timer
    // if the timer expires, speak the last message out loud
    // if new messages come in, restart the timer
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
            setPartToShow("result");
          },
          endSpeakCallback: () => {
            setIsSpeaking(false);
            setPartToShow("start");
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
    stopRecording();
    resetRecording?.();
  };

  return (
    <Screen id={id} isActive={isActive}>
      <div className={s.wrapper} data-show={partToShow}>
        <article
          className={s.transcriptBlock}
          data-show={partToShow === "start"}
          style={{
            transitionDelay: "0.5s",
          }}
        >
          <p>
            <span>Question</span> Lorem ipsum dolor sit amet consectetur. Leo
            nisi odio aliquam cursus egestas. Augue venenatis tincidunt in
            volutpat. Nascetur amet auctor sem non fermentum. Velit sem
            ullamcorper tellus sed scelerisque ipsum elementum.
          </p>
        </article>

        <div className={s.recording}>
          <p>"I'm listening"</p>
          <PressCTA label="Stop recording" onPress={handleStopRecording} />
        </div>

        <div className={s.thinking}>
          <p>"Thinking..."</p>
        </div>

        <div className={s.speaking}>
          <p>"Speaking..."</p>
        </div>
      </div>

      {messages && messages.length > 2 && (
        <div className={s.ending}>
          <p>
            You can ask another question or we can end the conversation here. To
            ask a follow up press and hold. To end tap the close button on the
            top right.
          </p>

          <PressCTA label="End" onPress={handleGoToOutro} />
        </div>
      )}

      {partToShow === "start" && (
        <PressCTA label="Press" onPress={handlePress} />
      )}
    </Screen>
  );
};

export default QuestionScreen;
