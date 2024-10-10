import { useEffect, useState } from "react";

import convertSpeechToText from "@/utils/speech-to-text";

import useRecorder from "@/hooks/use-recorder";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import { Screen } from "@/components/Stage/Stage";
import PressCTA from "@/components/PressCTA/PressCTA";
import PressAndHoldCTA from "@/components/PressAndHoldCTA/PressAndHoldCTA";
import FadeInWrapper from "@/components/TransitionWrapper/TransitionWrapper";

import s from "./screens.module.css";
import { HighlightBlock } from "@/components/Transcript/Transcript.utils";
import { TConvertedSTTResponse } from "@/utils/shared-types";

type TPartToShow = null | "idle" | "recording" | "recap";

const DELAY_UNIT = 400;

const FirstQuestionScreen = ({ isActive }: { isActive: boolean }) => {
  const {
    setGlobalState,
    setIsListening,
    setIsThinking,
    firstQuestion,
    setFirstQuestion,
  } = useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useState<TPartToShow>(null);

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
    setIsListening(true);
    startRecording();
  };

  const handleStopRecording = () => {
    setIsListening(false);
    stopRecording();
  };

  useEffect(() => {
    if (isActive && audioURL && audioFile) {
      setIsThinking(true);
      convertSpeechToText({
        audioFile: audioFile,
        errorCallback: (error) => {
          window.alert(error);
          setIsThinking(false);
          setPartToShow("idle");
        },
        successCallback: (res: TConvertedSTTResponse) => {
          if (!firstQuestion) {
            setFirstQuestion(" ");
            let question = "";
            let timer = 1100;
            res.words.forEach((word) => {
              setTimeout(() => {
                question += word.word + " ";
                setFirstQuestion(question);
              }, timer);
              timer += 80;
            });
          }

          resetRecording?.();
          setIsThinking(false);
          setPartToShow("recap");
        },
      });
    }
  }, [audioURL, audioFile]);

  useEffect(() => {
    setIsListening(isRecording);
  }, [isRecording]);

  const handleRecordAgain = () => {
    setFirstQuestion("");
    setPartToShow("idle");
    resetRecording?.();
  };

  const handleGoToNextScreen = () => {
    setGlobalState("tarot");
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
            show={partToShow === "idle"}
            delay={2 * DELAY_UNIT}
            className={s.copy}
          >
            <p>
              <span data-header="true">Question</span>
              Now is the time to ask your question to irmai. This will guide the
              type of conversation you would like to have.
            </p>
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "idle"}
            delay={3 * DELAY_UNIT}
            className={s.copy}
          >
            <p>Press and hold the button below to record your question.</p>
          </FadeInWrapper>
        </section>
        <section
          className={s.screenPartWrapper}
          data-interactive={partToShow === "recap"}
        >
          <FadeInWrapper
            show={partToShow === "recap" && firstQuestion.length > 0}
            delay={2 * DELAY_UNIT}
          >
            <HighlightBlock header="Question">
              <p>{firstQuestion}</p>
              <p className={s.recordAgainLink}>
                <em onClick={handleRecordAgain}>record again</em>
              </p>
            </HighlightBlock>
          </FadeInWrapper>
        </section>

        <section className={`${s.screenPartWrapper} ${s.tempAiFeedback}`}>
          <FadeInWrapper show={partToShow === "recording"} delay={100}>
            <div className={s.recording}>
              <p>"Listening..."</p>
            </div>
          </FadeInWrapper>
        </section>

        <footer className={s.footer}>
          <FadeInWrapper
            className={s.footerPart}
            show={partToShow === "idle" || partToShow === "recording"}
            delay={4 * DELAY_UNIT}
          >
            <PressAndHoldCTA
              onBeginPress={() => handleStartRecording()}
              onEndPress={() => handleStopRecording()}
              onRelease={() => handleStopRecording()}
              pressDuration={360000}
              idleChildren="Press & hold to record"
              activeChildren="Release to stop"
            />
          </FadeInWrapper>
          <FadeInWrapper
            className={s.footerPart}
            show={partToShow === "recap"}
            delay={100}
          >
            <PressCTA onPress={handleGoToNextScreen} label="Next" />
          </FadeInWrapper>
        </footer>
      </div>
    </Screen>
  );
};

export default FirstQuestionScreen;
