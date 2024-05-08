import { useEffect } from "react";

import { prepareSystemPrompt } from "@/utils/prompts";
import { IChatProps } from "@/utils/shared-types";

import { useDebounce } from "@/hooks/use-debounce";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressCTA from "@/components/PressCTA/PressCTA";
import { Screen } from "@/components/Stage/Stage";
import FadeInWrapper from "@/components/FadeInWrapper/FadeInWrapper";

import s from "./screens.module.css";

type TPartToShow = null | "welcome" | "focus";

const LandingScreen = ({
  isActive,
  chatProps,
}: {
  isActive: boolean;
  chatProps?: IChatProps;
}) => {
  const { setGlobalState } = useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useDebounce<TPartToShow>(null, 100);

  /* useEffect(() => {
    prepareSystemPrompt(chatProps.append);
  }, []); */

  useEffect(() => {
    setPartToShow(isActive ? "welcome" : null);
  }, [isActive]);

  const handleNextPart = () => {
    setPartToShow("focus");
  };

  const handleNextScreen = () => {
    if (partToShow === "focus") {
      setPartToShow(null);
      setGlobalState("focus");
    }
  };

  return (
    <Screen isActive={isActive}>
      <div className={s.wrapper} data-show={partToShow}>
        {/* Part 1 - welcome */}
        <section className={s.screenPartWrapper}>
          <FadeInWrapper
            show={partToShow === "welcome"}
            className={s.copy}
            delay={1000}
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
            delay={1500}
          >
            <p>There is power within your fingertips.</p>
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "welcome"}
            className={s.copy}
            delay={2000}
          >
            <p>
              Pressing, holding, and speaking, will let you connect with your
              spiritual guide.
            </p>
          </FadeInWrapper>
        </section>

        {/* Part 2 - focus */}
        <section className={s.screenPartWrapper}>
          <FadeInWrapper
            show={partToShow === "focus"}
            className={s.copy}
            delay={1000}
          >
            <p>
              <span>Focus</span>
              to form a focused intention for a tarot reading, reflect on your
              current situation and distill it into a clear, specific question
              or intention. Phrase your question carefully to invite actionable
              guidance and insight, ensuring it captures the essence of what you
              want to explore.
            </p>
          </FadeInWrapper>
          <FadeInWrapper
            show={partToShow === "focus"}
            className={s.copy}
            delay={1500}
          >
            <p>
              Now is the time to give your focus to IRMAI. This will guide the
              type of conversation you would like to have.
            </p>
          </FadeInWrapper>
        </section>

        <footer className={s.footer}>
          <FadeInWrapper
            className={s.footerPart}
            show={partToShow === "welcome"}
            delay={2500}
          >
            <PressCTA onPress={handleNextPart} label="Next" />
          </FadeInWrapper>
          <FadeInWrapper
            className={s.footerPart}
            show={partToShow === "focus"}
            delay={2000}
          >
            <PressCTA onPress={handleNextScreen} label="Next" />
          </FadeInWrapper>
        </footer>
      </div>
    </Screen>
  );
};

export default LandingScreen;
