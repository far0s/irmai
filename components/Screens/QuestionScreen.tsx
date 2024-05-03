"use client";
import { useEffect, useState } from "react";

import { withoutTrailingPeriod, prepareFirstPrompt } from "@/utils";
import { cirka } from "@/utils/fonts";
import { IChatProps } from "@/utils/shared-types";
import useRecorder from "@/utils/use-recorder";

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
      convertAudioToTranscript(audioFile);
    }
  }, [audioURL, audioFile]);

  useEffect(() => {
    setIsListening(isRecording);
  }, [isRecording]);

  // TODO: refactor this to a shared function
  const convertAudioToTranscript = async (audioFile: any) => {
    setIsThinking(true);
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
      if (!firstQuestion)
        setFirstQuestion(withoutTrailingPeriod(response.text));
      resetRecording?.();
      append?.({
        content: !firstQuestion
          ? prepareFirstPrompt({
              focus,
              firstQuestion: withoutTrailingPeriod(response.text),
              cards: selectedCards,
            })
          : response.text,
        role: "user",
      } as any);
    }
  };

  // TODO: refactor this to a shared function
  const speakLastMessage = async (message: any) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(async (stream) => {
          const whisper = await fetch("/api/text-to-speech", {
            method: "POST",
            body: JSON.stringify({
              input: message.content,
              voice: "nova", // alloy, echo, fable, onyx, nova, and shimmer
            }),
          }).then((res) => {
            setIsThinking(false);
            setIsSpeaking(true);
            setPartToShow("result");
            return res;
          });

          const audioContext = new AudioContext();
          const audioBuffer = await audioContext.decodeAudioData(
            await whisper.arrayBuffer()
          );
          const audioSource = audioContext.createBufferSource();
          audioSource.buffer = audioBuffer;
          audioSource.connect(audioContext.destination);
          const gainNode = audioContext.createGain();
          gainNode.gain.value = 0.5;
          audioSource.connect(gainNode);
          gainNode.connect(audioContext.destination);
          audioSource.start();
          audioSource.onended = () => {
            setIsSpeaking(false);
            stream.getTracks().forEach((track: any) => track.stop());
            setPartToShow("start");
          };
        })
        .catch((error) => console.log("Something went wrong!", error));
    } else {
      console.log("getUserMedia is not supported");
    }
  };

  useEffect(() => {
    if (!isActive) return;
    // start a timer for 2 seconds
    // when new messages come in,
    // check if the last message was from the assistant
    // if so, restart the timer
    // if the timer expires, speak the last message out loud
    // if new messages come in, restart the timer
    if (messages?.length === 0) return;

    // if the last message was from the assistant, setIrmaiIsThinking(false);
    const lastMessage = messages?.[messages.length - 1];

    const timer = setTimeout(() => {
      if (lastMessage?.role === "assistant") {
        speakLastMessage(lastMessage);
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
            <span className={`${cirka.className}`}>Question</span> Lorem ipsum
            dolor sit amet consectetur. Leo nisi odio aliquam cursus egestas.
            Augue venenatis tincidunt in volutpat. Nascetur amet auctor sem non
            fermentum. Velit sem ullamcorper tellus sed scelerisque ipsum
            elementum.
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
