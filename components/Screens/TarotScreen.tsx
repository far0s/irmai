import { useEffect, useState } from "react";

// import { useDebounce } from "@/hooks/use-debounce";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressCTA from "@/components/PressCTA/PressCTA";
import { Screen } from "@/components/Stage/Stage";
import FadeInWrapper from "@/components/TransitionWrapper/TransitionWrapper";
import {
  CardsOverviewBlock,
  HighlightBlock,
  TextBlock,
} from "@/components/Transcript/Transcript.utils";
import CardsShaker from "@/components/CardsShaker/CardsShaker";

import s from "./screens.module.css";

type TPartToShow = null | "overview" | "pulling";

const TarotScreen = ({ isActive }: { isActive: boolean }) => {
  const { setGlobalState, selectedCards, firstQuestion } = useIrmaiStore(
    (s) => s
  );
  const [partToShow, setPartToShow] = useState<TPartToShow>(null);

  useEffect(() => {
    setPartToShow(isActive ? "overview" : null);
  }, [isActive]);

  useEffect(() => {
    if (selectedCards.length === 3) {
      window.setTimeout(() => {
        setPartToShow("overview");
      }, 1300);
    }
  }, [selectedCards]);

  const handleCTAPress = () => {
    selectedCards.length < 3
      ? setPartToShow("pulling")
      : setGlobalState("discussion");
  };

  return (
    <Screen isActive={isActive}>
      <div className={s.wrapper} data-show={partToShow}>
        <section
          className={s.screenPartWrapper}
          data-interactive={partToShow === "overview"}
        >
          <FadeInWrapper
            show={partToShow === "overview" && firstQuestion.length > 0}
            delay={1000}
          >
            <HighlightBlock header="Question">
              <p>{firstQuestion}</p>
            </HighlightBlock>
          </FadeInWrapper>
          <FadeInWrapper
            className={s.copy}
            show={partToShow === "overview"}
            delay={1000}
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
          </FadeInWrapper>
        </section>

        <section
          className={s.screenPartWrapper}
          data-interactive={partToShow === "pulling"}
        >
          <FadeInWrapper show={partToShow === "pulling"}>
            <CardsShaker show={partToShow === "pulling"} />
          </FadeInWrapper>
        </section>
      </div>

      <footer className={s.footer}>
        <FadeInWrapper
          className={s.footerPart}
          show={partToShow === "overview"}
          delay={1000}
        >
          <PressCTA
            onPress={handleCTAPress}
            label={
              selectedCards.length === 0
                ? "Pull your cards"
                : "Tell me my future"
            }
          />
        </FadeInWrapper>
      </footer>
    </Screen>
  );
};

export default TarotScreen;
