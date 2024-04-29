import { useEffect, useState, useRef } from "react";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressAndHoldCTA from "@/components/PressAndHoldCTA/PressAndHoldCTA";
import { Screen } from "../Stage.utils";
import s from "./screens.module.css";
import { cirka } from "@/utils/fonts";
import useRecorder from "@/utils/use-recorder";

const FocusScreen = ({ isActive, id }: { isActive: boolean; id: string }) => {
  const { setGlobalState, setIsListening, setFocus, focus } = useIrmaiStore(
    (s) => s
  );
  const [partToShow, setPartToShow] = useState<
    null | "start" | "copy2" | "recording" | "end" | "result"
  >(null);
  const timeout1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeout2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeout3 = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  }, [isActive]);

  const handlePress = () => {
    timeout1.current = setTimeout(() => {
      setPartToShow("copy2");
    }, 500);

    timeout2.current = setTimeout(() => {
      setPartToShow("end");
    }, 3000);

    timeout3.current = setTimeout(() => {
      setPartToShow("recording");
      // TODO: start recording
      // FIXME: check for permission
      startRecording();
    }, 5000);
  };

  const handleRelease = () => {
    timeout1.current && clearTimeout(timeout1.current);
    timeout2.current && clearTimeout(timeout2.current);
    timeout3.current && clearTimeout(timeout3.current);

    // if recording is ongoing, stop it
    isRecording && stopRecording();
    setPartToShow("result");

    // if recording is done, set the global state to "tarot"
    // wait 1s to allow for the audio to be processed
    setTimeout(() => {
      setGlobalState("tarot");
      // reset the part to show
      setPartToShow("start");
    }, 2000);
  };

  const handleEndPress = () => {
    // this should not run as the recording will be ongoing
    // setGlobalState("focus");
  };

  useEffect(() => {
    if (audioURL && audioFile) {
      convertAudioToTranscript(audioFile);
    }
  }, [audioURL, audioFile]);

  useEffect(() => {
    setIsListening(isRecording);
  }, [isRecording]);

  const convertAudioToTranscript = async (audioFile: any) => {
    const formData = new FormData();
    formData.append("file", audioFile);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    formData.append("safari", isSafari.toString());
    const response = await fetch("/api/speech-to-text", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .catch((err) => window.alert(err));
    if (response && response.text) {
      setFocus(response.text);
    }
    if (resetRecording) {
      resetRecording();
    }
  };

  return (
    <Screen isActive={isActive} id={id}>
      <div className={s.wrapper} data-show={partToShow}>
        <div className={s.copy}>
          <p>
            <span className={`${cirka.className}`}>Focus</span>
            to form a focused intention for a tarot reading, reflect on your
            current situation and distill it into a clear, specific question or
            intention. Phrase your question carefully to invite actionable
            guidance and insight, ensuring it captures the essence of what you
            want to explore.
          </p>
        </div>
        <div className={s.copy}>
          <p>
            Now is the time to give your focus to IRMAI. This will give guide
            the type of conversation you would like to have.
          </p>
        </div>

        <div className={s.listening}>"I'm listening"</div>
        <div className={s.focusResult}>
          <p>Your focus is: {focus}</p>
        </div>

        <footer className={s.footer}>
          <PressAndHoldCTA
            onBeginPress={handlePress}
            onEndPress={handleEndPress}
            onRelease={handleRelease}
            pressDuration={60000} // put a super long duration to allow for a long audio recording
          />
        </footer>
      </div>
    </Screen>
  );
};

export default FocusScreen;
