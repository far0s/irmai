import { useEffect } from "react";

import { useDebounce } from "@/hooks/use-debounce";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressCTA from "@/components/PressCTA/PressCTA";
import { Screen } from "@/components/Stage/Stage";
import FadeInWrapper from "@/components/TransitionWrapper/TransitionWrapper";

import s from "./screens.module.css";

type TPartToShow = null | "intro";

const DELAY_UNIT = 400;

const IntroScreen = ({
  isActive,
}: {
  isActive: boolean;
  assistantProps?: any;
}) => {
  const { setGlobalState } = useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useDebounce<TPartToShow>(null, 100);

  useEffect(() => {
    setPartToShow(isActive ? "intro" : null);
  }, [isActive]);

  const handleNextScreen = () => {
    setPartToShow(null);
    setGlobalState("chat");
  };

  return (
    <Screen isActive={isActive}>
      <div className={s.wrapper} data-show={partToShow}>
        <section
          className={s.screenPartWrapper}
          data-interactive={isActive && partToShow === "intro"}
        >
          <FadeInWrapper
            show={partToShow === "intro"}
            className={s.copy}
            delay={4 * DELAY_UNIT}
          >
            <p>
              <span>Welcome</span>
              irmai is your audio-visual spiritual guide, and will guide you on
              a journey of self discovery and inner peace.
            </p>
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "intro"}
            className={s.copy}
            delay={5 * DELAY_UNIT}
          >
            <p style={{ textAlign: "center" }}>✳︎✳︎✳︎</p>
          </FadeInWrapper>

          <FadeInWrapper
            show={partToShow === "intro"}
            className={s.copy}
            delay={6 * DELAY_UNIT}
          >
            <p>
              <span>Question</span>
              To form an intention for a tarot reading, reflect on your current
              situation and distill it into a clear, specific question or
              intention.
            </p>
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "intro"}
            className={s.copy}
            delay={7 * DELAY_UNIT}
          >
            <p>
              Phrase your question carefully to invite actionable guidance and
              insight, ensuring it captures the essence of what you want to
              explore.
            </p>
          </FadeInWrapper>
        </section>

        <footer className={s.footer}>
          <FadeInWrapper
            className={s.footerPart}
            show={partToShow === "intro"}
            delay={8 * DELAY_UNIT}
          >
            <PressCTA onPress={handleNextScreen} label="Start" />
          </FadeInWrapper>
        </footer>
      </div>
    </Screen>
  );
};

export default IntroScreen;
