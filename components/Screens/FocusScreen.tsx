import { useEffect, useState, useRef } from "react";

import { withoutTrailingPeriod } from "@/utils";
import convertSpeechToText from "@/utils/speech-to-text";

import useRecorder from "@/hooks/use-recorder";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressAndHoldCTA from "@/components/PressAndHoldCTA/PressAndHoldCTA";
import { Screen } from "@/components/Stage/Stage";

import s from "./screens.module.css";
import FadeInWrapper from "../FadeInWrapper/FadeInWrapper";

type TPartToShow = null | "recording";

const FocusScreen = ({ isActive }: { isActive: boolean }) => {
  const { setGlobalState, setIsListening, setFocus } = useIrmaiStore((s) => s);
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
    setPartToShow(isActive ? "recording" : null);
  }, [isActive]);

  const handleStopRecording = () => {
    stopRecording();
  };

  useEffect(() => {
    // TODO: refactor the callbacks
    audioURL &&
      audioFile &&
      convertSpeechToText({
        audioFile: audioFile,
        errorCallback: () => window.alert("Error converting speech to text"),
        successCallback: (data) => {
          setFocus(withoutTrailingPeriod(data.text));
          setPartToShow("recording");
          setGlobalState("tarot");
          resetRecording?.();
        },
      });
  }, [audioURL, audioFile]);

  useEffect(() => {
    setIsListening(isRecording);
  }, [isRecording]);

  return (
    <Screen isActive={isActive}>
      <div className={s.wrapper} data-show={partToShow}>
        <section className={s.screenPartWrapper}>
          <FadeInWrapper
            show={partToShow === "recording"}
            className={s.recording}
          >
            <p>"I'm listening"</p>
          </FadeInWrapper>
        </section>

        <footer className={s.footer}>
          <FadeInWrapper
            className={s.footerPart}
            show={partToShow === "recording"}
          >
            <PressAndHoldCTA
              onBeginPress={startRecording}
              onEndPress={handleStopRecording}
              onRelease={handleStopRecording}
              pressDuration={360000}
              idleChildren="Hold to record"
              activeChildren="Release to stop"
            />
          </FadeInWrapper>
        </footer>
      </div>
    </Screen>
  );
};

export default FocusScreen;
