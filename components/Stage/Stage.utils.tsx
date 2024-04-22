"use client";
import { useEffect, useState } from "react";
import s from "./stage.module.css";
import TextBubble from "@/components/TextBubble/TextBubble";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressAndHoldCTA from "@/components/PressAndHoldCTA/PressAndHoldCTA";

const Screen = ({
  isActive,
  id,
  children,
}: {
  isActive: boolean;
  id: string;
  children: React.ReactNode;
}) => {
  return (
    <div id={id} className={s.screen} data-is-active={isActive}>
      {children}
    </div>
  );
};

const SplashScreen = ({ isActive, id }: { isActive: boolean; id: string }) => {
  const { globalState, setGlobalState, hasSeenSplash, setHasSeenSplash } =
    useIrmaiStore((s) => s);

  useEffect(() => {
    if (globalState !== "splash") {
      return;
    }
    if (hasSeenSplash) {
      return setGlobalState("landing");
    }

    setHasSeenSplash(true);

    setTimeout(() => setGlobalState("landing"), 1800);
  }, [globalState]);

  return (
    <Screen id={id} isActive={isActive}>
      <span
        style={{
          display: "none",
          visibility: "hidden",
        }}
      >
        irmai welcomes you
      </span>
    </Screen>
  );
};

const LandingScreen = ({ isActive, id }: { isActive: boolean; id: string }) => {
  const { setGlobalState } = useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useState<
    "heading" | "copy1" | "copy2" | "end"
  >("heading");

  let timeout1: ReturnType<typeof setTimeout>,
    timeout2: ReturnType<typeof setTimeout>,
    timeout3: ReturnType<typeof setTimeout>;

  const handlePress = () => {
    timeout1 = setTimeout(() => {
      setPartToShow("copy1");
    }, 500);

    timeout2 = setTimeout(() => {
      setPartToShow("copy2");
    }, 2000);

    timeout3 = setTimeout(() => {
      setPartToShow("end");
    }, 4000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  };

  const handleRelease = () => {
    clearTimeout(timeout1);
    clearTimeout(timeout2);
    clearTimeout(timeout3);
    setPartToShow("heading");
  };

  return (
    <Screen isActive={isActive} id={id}>
      <div className={s.landing} data-show={partToShow}>
        <div className={s.landingHeading}>
          <h2 className={s.heading}>
            Ready to embark on a journey of self-discovery?
          </h2>
        </div>
        <div className={s.landingCopy1}>
          <TextBubble symbol="*">
            There is power within your fingertips
          </TextBubble>
        </div>
        <div className={s.landingCopy2}>
          <TextBubble symbol="&">
            Pressing, holding, and speaking, will let you connect with your
            spiritual guide
          </TextBubble>
        </div>

        <div className={s.landingCTA}>
          <PressAndHoldCTA
            onBeginPress={handlePress}
            onEndPress={() => setGlobalState("intro")}
            onRelease={handleRelease}
            pressDuration={5000}
          />
        </div>
      </div>
    </Screen>
  );
};

const IntroScreen = ({ isActive, id }: { isActive: boolean; id: string }) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <p>A reading starts with a small question to irmai.</p>

      <PressAndHoldCTA
        onBeginPress={null}
        onEndPress={() => setGlobalState("asking-focus")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const AskingFocusScreen = ({
  isActive,
  id,
}: {
  isActive: boolean;
  id: string;
}) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <h2>What’s your focus of this conversation?</h2>

      <PressAndHoldCTA
        onBeginPress={null}
        onEndPress={() => setGlobalState("asking-tarot")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const AskingTarotScreen = ({
  isActive,
  id,
}: {
  isActive: boolean;
  id: string;
}) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <h2>Shuffle Cards + results</h2>

      <PressAndHoldCTA
        onBeginPress={null}
        onEndPress={() => setGlobalState("asking-question")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const AskingQuestionScreen = ({
  isActive,
  id,
}: {
  isActive: boolean;
  id: string;
}) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <h2>What is your question?</h2>

      <PressAndHoldCTA
        onBeginPress={null}
        onEndPress={() => setGlobalState("answering")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const AnsweringScreen = ({
  isActive,
  id,
}: {
  isActive: boolean;
  id: string;
}) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <h2>Answering...</h2>

      <PressAndHoldCTA
        onBeginPress={null}
        onEndPress={() => setGlobalState("answering-followup")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const AnsweringFollowupScreen = ({
  isActive,
  id,
}: {
  isActive: boolean;
  id: string;
}) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <h2>Follow up question</h2>

      <PressAndHoldCTA
        onBeginPress={null}
        onEndPress={() => setGlobalState("outro")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const OutroScreen = ({ isActive, id }: { isActive: boolean; id: string }) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <h2 className={s.heading}>
        I hope you gained some insights from our convo!
      </h2>

      <PressAndHoldCTA
        onBeginPress={null}
        onEndPress={() => setGlobalState("landing")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const StageScreens = {
  splash: SplashScreen,
  landing: LandingScreen,
  intro: IntroScreen,
  "asking-focus": AskingFocusScreen,
  "asking-tarot": AskingTarotScreen,
  "asking-question": AskingQuestionScreen,
  answering: AnsweringScreen,
  "answering-followup": AnsweringFollowupScreen,
  outro: OutroScreen,
};

export default StageScreens;
