import { useEffect, useState, useRef } from "react";
import Markdown from "markdown-to-jsx";

import { withoutTrailingPeriod } from "@/utils";
import { prepareFirstPrompt } from "@/utils/prompts";
import { ChatMessage, TConvertedSTTResponse } from "@/utils/shared-types";
import convertSpeechToText from "@/utils/speech-to-text";
import convertTextToSpeech, { updateAudioVolume } from "@/utils/text-to-speech";

import useRecorder from "@/hooks/use-recorder";
import { useDebounce } from "@/hooks/use-debounce";
import useTranscript from "@/hooks/use-transcript";
import useScrollToBottom from "@/hooks/use-scroll-to-bottom";
import useScrollToTop from "@/hooks/use-scroll-to-top";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import { Screen } from "@/components/Stage/Stage";
import GlassyButton from "@/components/GlassyButton/GlassyButton";
import GlassyHoldButton from "@/components/GlassyButton/GlassyHoldButton";
import TransitionWrapper from "@/components/TransitionWrapper/TransitionWrapper";
import SpeakOrThinkIndicator from "@/components/SpeakOrThinkIndicator/SpeakOrThinkIndicator";
import {
  CardsOverviewBlock,
  HighlightBlock,
  TextBlock,
} from "@/components/Transcript/Transcript.utils";
import CardsShaker from "@/components/CardsShaker/CardsShaker";
import { DELAY_UNIT } from "@/utils";

import s from "./screens.module.css";

type TPartToShow =
  | null
  | "idle"
  | "recording"
  | "transcript"
  | "cards"
  | "thinking";

const ChatScreen = ({
  isActive,
  assistantProps,
}: {
  isActive: boolean;
  assistantProps: any;
}) => {
  const {
    setGlobalState,
    isListening,
    setIsListening,
    setIsThinking,
    firstQuestion,
    setFirstQuestion,
    selectedCards,
    setSelectedCards,
    setIsSpeaking,
    isSpeaking,
    isThinking,
    isMuted, // Add the isMuted state from the store
  } = useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useDebounce<TPartToShow>(null, 100);
  const [lastMessage, setLastMessage] = useState(null);
  const [tempSelectedCards, setTempSelectedCards] = useState<any[]>([]);
  const { messages, append }: any = assistantProps;

  const transcript = useTranscript(messages, lastMessage);
  const questionWrapperRef = useRef<HTMLDivElement | null>(null);
  const cardsWrapperRef = useRef<HTMLDivElement | null>(null);
  const trancriptWrapperRef = useScrollToBottom({
    readyToScroll: isActive && partToShow === "transcript",
  });

  const {
    startRecording,
    stopRecording,
    resetRecording,
    audioURL,
    isRecording,
    audioFile,
  } = useRecorder();

  useEffect(() => {
    setPartToShow(
      isActive ? (firstQuestion?.length > 0 ? "transcript" : "idle") : null
    );
    if (checkIfIrmaiHasAlreadyAnswered()) return;
    handleSendFirstQuestion();
  }, [isActive]);

  const handleStartRecording = () => {
    if (!firstQuestion) setPartToShow("recording");
    setIsListening(true);
    startRecording();
  };

  const handleStopRecording = () => {
    setIsListening(false);
    stopRecording();
  };

  useEffect(() => {
    // select the DOM element with a class containing "pageContainer"
    const pageContainer = document.querySelector("[class*='pageContainer']");
    partToShow === "cards"
      ? pageContainer?.classList.add("cards-visible")
      : pageContainer?.classList.remove("cards-visible");
  }, [partToShow]);

  useEffect(() => {
    if (isActive && audioURL && audioFile) {
      setIsThinking(true);
      convertSpeechToText({
        audioFile: audioFile,
        errorCallback: (error) => {
          setIsThinking(false);
          setPartToShow(messages.length > 0 ? "transcript" : "idle");
        },
        successCallback: (res: TConvertedSTTResponse) => {
          if (!res?.text) {
            window.alert("Sorry, I didn't catch that. Can you repeat?");
            resetRecording?.();
            setIsThinking(false);
            setPartToShow(messages.length > 0 ? "transcript" : "idle");
            return;
          }
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
          } else {
            append?.({
              content: !firstQuestion
                ? prepareFirstPrompt({
                    firstQuestion: withoutTrailingPeriod(res.text),
                    cards: selectedCards,
                  })
                : res.text,
              role: "user",
            } as any);
          }
          resetRecording?.();
          setPartToShow("transcript");
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

  const handleGoToCards = () => {
    setPartToShow("cards");
    setSelectedCards([]);
  };

  const handleGoToOutro = () => {
    setGlobalState("outro");
    setIsListening(false);
    resetRecording?.();
  };

  useEffect(() => {
    if (!isActive) return;
    if (selectedCards.length === 3) {
      setIsThinking(true);
      handleSendFirstQuestion();
      window.setTimeout(() => {
        setPartToShow("transcript");
      }, 600);
    }
  }, [selectedCards]);

  const checkIfIrmaiHasAlreadyAnswered = () => {
    const msgs: ChatMessage[] | undefined = messages?.filter(
      (message: ChatMessage) => message.role === "assistant"
    );

    return (msgs && msgs.length > 0) || false;
  };

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

  useEffect(() => {
    if (!isActive) return;
    if (isSpeaking) return;
    if (firstQuestion?.length === 0) return;
    if (messages?.length === 0) return;

    const lastMessage = messages?.[messages.length - 1];

    const timer = setTimeout(() => {
      if (isSpeaking) return;
      if (lastMessage?.role === "assistant") {
        setIsThinking(true);
        convertTextToSpeech({
          mediaDevices: navigator.mediaDevices,
          message: lastMessage,
          startSpeakCallback: () => {
            setIsThinking(false);
            setIsSpeaking(true);
            setLastMessage(lastMessage);
          },
          endSpeakCallback: () => {
            setIsSpeaking(false);
            setLastMessage(null);
          },
          isMuted: isMuted, // Pass the isMuted state to control audio volume
        });
      } else if (lastMessage?.role === "user") {
        setIsSpeaking(false);
        setLastMessage(lastMessage);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [messages]);

  // Add effect to update audio volume when isMuted changes
  useEffect(() => {
    updateAudioVolume(isMuted);
  }, [isMuted]);

  const showPlaceholderTranscriptItem =
    transcript.length === 0 ||
    (transcript[transcript.length - 1].role === "assistant" && isThinking);

  useScrollToTop(questionWrapperRef, isActive && partToShow === "idle");
  useScrollToTop(cardsWrapperRef, isActive && partToShow === "cards");

  return (
    <Screen isActive={isActive}>
      <div className={s.wrapper}>
        <section
          className={s.screenPartWrapper}
          data-interactive={isActive && partToShow === "idle"}
          ref={questionWrapperRef}
        >
          <TransitionWrapper
            show={partToShow === "idle"}
            delay={2 * DELAY_UNIT}
            className={s.copy}
          >
            <p>
              <span data-header="true">Your Question</span>
              Now is the time to ask your question to irmai. This will guide the
              type of conversation you would like to have.
            </p>
          </TransitionWrapper>
          <TransitionWrapper
            show={partToShow === "idle"}
            delay={3 * DELAY_UNIT}
            className={s.copy}
          >
            <p>Press and hold the button below to record your question.</p>
          </TransitionWrapper>
        </section>
        <section
          className={s.screenPartWrapper}
          data-interactive={isActive && partToShow === "transcript"}
          ref={trancriptWrapperRef}
        >
          <TransitionWrapper
            show={partToShow === "transcript" && firstQuestion.length > 0}
            delay={2 * DELAY_UNIT}
          >
            <HighlightBlock header="✳︎ Question">
              <p>{firstQuestion}</p>

              {selectedCards.length === 0 && (
                <p className={s.recordAgainLink}>
                  <em onClick={handleRecordAgain}>record again</em>
                </p>
              )}
            </HighlightBlock>
          </TransitionWrapper>
          <TransitionWrapper
            className={s.copy}
            show={partToShow === "transcript"}
            delay={3 * DELAY_UNIT}
          >
            {selectedCards.length > 0 ? (
              <CardsOverviewBlock cards={selectedCards} />
            ) : (
              <TextBlock>
                <span data-header="true">Cards</span> Each card has symbolic
                meanings that represent different aspects of your life, such as
                relationships, career, emotions, and more.
              </TextBlock>
            )}
          </TransitionWrapper>
          <TransitionWrapper
            className={s.copy}
            show={
              partToShow === "transcript" &&
              firstQuestion.length > 0 &&
              selectedCards.length > 0
            }
            delay={4 * DELAY_UNIT}
          >
            <TextBlock>
              <span data-header="true">✳︎ Your reading</span>
              <ul className={s.transcriptTranscript}>
                {transcript.length > 0 &&
                  transcript.map((item, i) => (
                    <li
                      key={item.id}
                      className={
                        item.role === "assistant"
                          ? s.transcriptItemAi
                          : s.transcriptItemUser
                      }
                    >
                      <div className={s.transcriptItemRole}>
                        {item.role === "assistant" ? "irmai" : "you"}
                        <SpeakOrThinkIndicator
                          role={item.role}
                          isSpeaking={isSpeaking}
                          isThinking={isThinking}
                          isLastMessage={
                            i === transcript.length - 1 &&
                            !showPlaceholderTranscriptItem
                          }
                        />
                      </div>
                      <Markdown className={s.markdown}>{item.content}</Markdown>
                    </li>
                  ))}

                {showPlaceholderTranscriptItem && (
                  <li className={s.transcriptItemAi}>
                    <div className={s.trancriptItemRole}>
                      <div className={s.transcriptItemRole}>
                        irmai
                        <SpeakOrThinkIndicator
                          role="assistant"
                          isSpeaking={false}
                          isThinking={isThinking}
                          isLastMessage={true}
                        />
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </TextBlock>
          </TransitionWrapper>
        </section>

        <section
          className={s.screenPartWrapper}
          data-interactive={isActive && partToShow === "cards"}
          ref={cardsWrapperRef}
        >
          <TransitionWrapper show={partToShow === "cards"} className={s.copy}>
            <p>
              <span data-header="true">
                Choose three cards (
                {selectedCards.length > 0
                  ? selectedCards.length
                  : tempSelectedCards.length}
                /3)
              </span>
            </p>
          </TransitionWrapper>
          <TransitionWrapper show={partToShow === "cards"} delay={DELAY_UNIT}>
            <CardsShaker
              show={partToShow === "cards"}
              tempSelectedCards={tempSelectedCards}
              setTempSelectedCards={setTempSelectedCards}
            />
          </TransitionWrapper>
        </section>

        <footer className={s.footer} data-show-backdrop={messages.length > 1}>
          {!isThinking &&
            !isSpeaking &&
            (partToShow === "idle" ||
              partToShow === "recording" ||
              (partToShow === "transcript" && messages.length > 1)) && (
              <TransitionWrapper
                show={
                  !isThinking &&
                  !isSpeaking &&
                  (partToShow === "idle" ||
                    partToShow === "recording" ||
                    (partToShow === "transcript" && messages.length > 1))
                }
                delay={
                  (partToShow === "transcript" && messages.length > 1 ? 1 : 4) *
                  DELAY_UNIT
                }
              >
                <GlassyHoldButton
                  onBeginPress={() => handleStartRecording()}
                  onEndPress={() => handleStopRecording()}
                  onRelease={() => handleStopRecording()}
                  pressDuration={360000}
                >
                  Press & hold to record
                </GlassyHoldButton>
              </TransitionWrapper>
            )}
          {partToShow === "transcript" && (
            <TransitionWrapper
              show={partToShow === "transcript"}
              delay={partToShow === "transcript" && messages.length > 1 ? 1 : 4}
            >
              {selectedCards.length === 0 && (
                <GlassyButton onClick={handleGoToCards}>
                  Pull your cards
                </GlassyButton>
              )}

              {!isThinking &&
                !isSpeaking &&
                partToShow === "transcript" &&
                messages.length > 2 && (
                  <GlassyButton onClick={handleGoToOutro}>
                    Or end the reading
                  </GlassyButton>
                )}
            </TransitionWrapper>
          )}
        </footer>
      </div>
    </Screen>
  );
};

export default ChatScreen;
