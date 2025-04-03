import { useEffect } from "react";

import { useDebounce } from "@/hooks/use-debounce";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import GlassyButton from "@/components/GlassyButton/GlassyButton";
import { Screen } from "@/components/Stage/Stage";
import FadeInWrapper from "@/components/TransitionWrapper/TransitionWrapper";

import { DELAY_UNIT } from "@/utils";

import s from "./screens.module.css";

type TPartToShow = null | "intro";

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
              <span>Question</span>
              To form an intention for a tarot reading, reflect on your current
              situation and distill it into a clear, specific question or
              intention.
            </p>
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "intro"}
            className={s.copy}
            delay={5 * DELAY_UNIT}
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
            delay={6 * DELAY_UNIT}
          >
            <GlassyButton onClick={handleNextScreen}>Start</GlassyButton>
          </FadeInWrapper>
        </footer>
      </div>
    </Screen>
  );
};

export default IntroScreen;
