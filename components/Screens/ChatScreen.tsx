import { useEffect } from "react";
import Markdown from "markdown-to-jsx";
import { motion } from "framer-motion";

import { withoutTrailingPeriod } from "@/utils";
import { prepareFirstPrompt } from "@/utils/prompts";
import { ChatMessage } from "@/utils/shared-types";
import convertSpeechToText from "@/utils/speech-to-text";
import convertTextToSpeech from "@/utils/text-to-speech";

import useRecorder from "@/hooks/use-recorder";
import { useDebounce } from "@/hooks/use-debounce";
import useTranscript from "@/hooks/use-transcript";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import { Screen } from "@/components/Stage/Stage";
import PressCTA from "@/components/PressCTA/PressCTA";
import PressAndHoldCTA from "@/components/PressAndHoldCTA/PressAndHoldCTA";
import TransitionWrapper from "@/components/TransitionWrapper/TransitionWrapper";

import s from "./screens.module.css";
import {
  CardsOverviewBlock,
  HighlightBlock,
  TextBlock,
} from "@/components/Transcript/Transcript.utils";
import CardsShaker from "@/components/CardsShaker/CardsShaker";
import { TConvertedSTTResponse } from "@/utils/shared-types";

type TPartToShow =
  | null
  | "idle"
  | "recording"
  | "transcript"
  | "cards"
  | "thinking";

const DELAY_UNIT = 400;

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
    conclusion,
  } = useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useDebounce<TPartToShow>(null, 100);
  const { messages, append }: any = assistantProps;
  const transcript = useTranscript(messages);

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
    if (firstQuestion.length > 0) return;
    if (selectedCards?.length === 0) return;
    const hasAlreadyAnswered = checkIfIrmaiHasAlreadyAnswered();
    if (hasAlreadyAnswered) return setPartToShow("transcript");
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
    if (isActive && audioURL && audioFile) {
      setIsThinking(true);
      convertSpeechToText({
        audioFile: audioFile,
        errorCallback: (error) => {
          console.log("error", error);
          window.alert(error);
          setIsThinking(false);
          setPartToShow(messages.length > 1 ? "transcript" : "idle");
        },
        successCallback: (res: TConvertedSTTResponse) => {
          if (!res.text) {
            window.alert("Sorry, I didn't catch that. Can you repeat?");
            setPartToShow("idle");
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
    if (selectedCards.length === 3) {
      window.setTimeout(() => {
        setPartToShow("transcript");
        handleSendFirstQuestion();
      }, 1300);
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
    setIsThinking(true);

    const timer = setTimeout(() => {
      const wrapper = document.querySelector(`.${s.wrapper}`);
      if (wrapper) {
        const height = wrapper.getBoundingClientRect().height;
        wrapper.scrollTo({
          top: height * 2,
          behavior: "smooth",
        });
      }
      if (lastMessage?.role === "assistant") {
        // TODO: refactor the callbacks
        convertTextToSpeech({
          mediaDevices: navigator.mediaDevices,
          message: lastMessage,
          startSpeakCallback: () => {
            setIsThinking(false);
            setIsSpeaking(true);
          },
          endSpeakCallback: () => {
            setIsSpeaking(false);
          },
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <Screen isActive={isActive}>
      <div className={s.wrapper}>
        <section
          className={s.screenPartWrapper}
          data-interactive={partToShow === "idle"}
        >
          <TransitionWrapper
            show={partToShow === "idle"}
            delay={2 * DELAY_UNIT}
            className={s.copy}
          >
            <p>
              <span data-header="true">Question</span>
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
          data-interactive={partToShow === "transcript"}
        >
          <TransitionWrapper
            show={partToShow === "transcript" && firstQuestion.length > 0}
            delay={2 * DELAY_UNIT}
          >
            <HighlightBlock header="Question">
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
                relationships, career, emotions, and more. As you choose the
                cards, I will interpret the symbols and archetypes to provide
                you with personalized insights and guidance. The cards are not
                meant to predict the future, but rather to offer a fresh
                perspective on your current situation and potential paths
                forward. My role is to be an intuitive guide, and we will work
                together to explore the messages the cards reveal and how they
                apply to your life.
              </TextBlock>
            )}
          </TransitionWrapper>
          <TransitionWrapper
            className={s.copy}
            show={partToShow === "transcript" && messages.length > 1}
            delay={4 * DELAY_UNIT}
          >
            <TextBlock>
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
                        {i === transcript.length - 1 && (
                          <motion.span
                            initial={{
                              opacity: 0,
                              filter: "blur(10px)",
                            }}
                            animate={{
                              opacity: isThinking || isSpeaking ? 1 : 0,
                              filter:
                                isThinking || isSpeaking
                                  ? "blur(0)"
                                  : "blur(10px)",
                            }}
                          >
                            {item.role === "assistant" &&
                              isThinking &&
                              " is thinking..."}
                            {item.role === "assistant" &&
                              isSpeaking &&
                              " is speaking..."}
                          </motion.span>
                        )}
                      </div>
                      <Markdown className={s.markdown}>{item.content}</Markdown>
                    </li>
                  ))}

                {conclusion.length > 0 && (
                  <li className={s.transcriptItemAi}>
                    <div className={s.trancriptItemRole}>
                      [end of conversation]
                    </div>
                  </li>
                )}
              </ul>
            </TextBlock>
          </TransitionWrapper>
        </section>

        <section
          className={s.screenPartWrapper}
          data-interactive={partToShow === "cards"}
        >
          <TransitionWrapper show={partToShow === "cards"}>
            <CardsShaker show={partToShow === "cards"} />
          </TransitionWrapper>
        </section>

        <footer className={s.footer} data-show-backdrop={messages.length > 1}>
          <TransitionWrapper
            className={s.footerPart}
            show={
              (!isThinking && partToShow === "idle") ||
              partToShow === "recording" ||
              (partToShow === "transcript" && messages.length > 1)
            }
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
          </TransitionWrapper>
          <TransitionWrapper
            className={s.footerPart}
            show={partToShow === "transcript"}
            delay={100}
          >
            {selectedCards.length === 0 && (
              <PressCTA onPress={handleGoToCards} label="Pull your cards" />
            )}
            {selectedCards.length > 0 && !isThinking && messages.length < 2 && (
              <PressCTA
                onPress={handleSendFirstQuestion}
                label="Tell me my future"
              />
            )}
            {partToShow === "transcript" && messages.length > 2 && (
              <PressCTA label="Or end the reading" onPress={handleGoToOutro} />
            )}
          </TransitionWrapper>
        </footer>
      </div>
    </Screen>
  );
};

export default ChatScreen;
