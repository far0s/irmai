import { useEffect } from "react";

import { useDebounce } from "@/hooks/use-debounce";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressCTA from "@/components/PressCTA/PressCTA";
import { Screen } from "@/components/Stage/Stage";
import FadeInWrapper from "@/components/TransitionWrapper/TransitionWrapper";

import s from "./screens.module.css";

type TPartToShow = null | "welcome" | "question";

const LandingScreen = ({
  isActive,
  assistantProps,
}: {
  isActive: boolean;
  assistantProps?: any;
}) => {
  const { setGlobalState } = useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useDebounce<TPartToShow>(null, 100);

  useEffect(() => {
    setPartToShow(isActive ? "welcome" : null);
  }, [isActive]);

  const handleNextPart = () => {
    setPartToShow("question");
  };

  const handleNextScreen = () => {
    if (partToShow === "question") {
      setPartToShow(null);
      setGlobalState("firstQuestion");
    }
  };

  return (
    <Screen isActive={isActive}>
      <div className={s.wrapper} data-show={partToShow}>
        {/* Part 1 - welcome */}
        <section
          className={s.screenPartWrapper}
          data-interactive={partToShow === "welcome"}
        >
          <FadeInWrapper
            show={partToShow === "welcome"}
            className={s.copy}
            delay={1500}
            variant="fade"
          >
            <p>
              <span>Welcome</span>
              irmai is your audio-visual spiritual guide. This is a journey of
              self-discovery and inner peace to nurture your spiritual growth
              and self connection.
            </p>
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "welcome"}
            className={s.copy}
            delay={2000}
            variant="fade"
          >
            <p>There is power within your fingertips.</p>
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "welcome"}
            className={s.copy}
            delay={2500}
            variant="fade"
          >
            <p>
              Pressing, holding, and speaking, will let you connect with your
              spiritual guide.
            </p>
          </FadeInWrapper>
        </section>

        {/* Part 2 - question */}
        <section
          className={s.screenPartWrapper}
          data-interactive={partToShow === "question"}
        >
          <FadeInWrapper
            show={partToShow === "question"}
            className={s.copy}
            delay={1000}
            variant="fade"
          >
            <p>
              <span>Question</span>
              to form an intention for a tarot reading, reflect on your current
              situation and distill it into a clear, specific question or
              intention. Phrase your question carefully to invite actionable
              guidance and insight, ensuring it captures the essence of what you
              want to explore.
            </p>
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "question"}
            className={s.copy}
            delay={1500}
            variant="fade"
          >
            <p>
              Now is the time to ask your question to IRMAI. This will guide the
              type of conversation you would like to have.
            </p>
          </FadeInWrapper>
        </section>

        <footer className={s.footer}>
          <FadeInWrapper
            className={s.footerPart}
            show={partToShow === "welcome"}
            delay={2500}
            variant="fade"
          >
            <PressCTA onPress={handleNextPart} label="Start" />
          </FadeInWrapper>
          <FadeInWrapper
            className={s.footerPart}
            show={partToShow === "question"}
            delay={2000}
            variant="fade"
          >
            <PressCTA onPress={handleNextScreen} label="Next" />
          </FadeInWrapper>
        </footer>
      </div>
    </Screen>
  );
};

export default LandingScreen;
