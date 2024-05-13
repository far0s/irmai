import { useEffect } from "react";

import { useDebounce } from "@/hooks/use-debounce";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressCTA from "@/components/PressCTA/PressCTA";
import { Screen } from "@/components/Stage/Stage";
import FadeInWrapper from "@/components/TransitionWrapper/TransitionWrapper";
import {
  CardsOverviewBlock,
  HighlightBlock,
  TextBlock,
} from "@/components/Transcript/Transcript.utils";

import s from "./screens.module.css";

type TPartToShow = null | "overview" | "pulling" | "result";

const CardsShaker = ({
  partToShow,
  selectedCards,
  pickTarotCards,
  setPartToShow,
}: {
  partToShow: TPartToShow;
  selectedCards: any[];
  pickTarotCards: () => Promise<void>;
  setPartToShow: (arg0: TPartToShow) => void;
}) => (
  <div className={s.cardsShaker} data-show={partToShow === "pulling"}>
    <div className={s.cardsContainer}>
      {selectedCards.length === 0 ? (
        <>
          <p>[cards will be shown here]</p>
          <PressCTA
            onPress={pickTarotCards}
            label="in the meantime click here to shuffle the cards"
          />
        </>
      ) : (
        <>
          <CardsOverviewBlock cards={selectedCards} />
          <PressCTA
            onPress={() => {
              setPartToShow("overview");
            }}
            label="go to results"
          />
        </>
      )}
    </div>
  </div>
);

const TarotScreen = ({ isActive }: { isActive: boolean }) => {
  const { setGlobalState, selectedCards, setSelectedCards, firstQuestion } =
    useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useDebounce<TPartToShow>(null, 100);

  useEffect(() => {
    setPartToShow(isActive ? "overview" : null);
  }, [isActive]);

  const handleCTAPress = () => {
    selectedCards.length === 0
      ? setPartToShow("pulling")
      : setGlobalState("discussion");
  };

  const pickTarotCards = async () =>
    await fetch("/api/tarot?n=3")
      .then((res) => res.json())
      .then((data) => setSelectedCards(data))
      .catch((err) => console.error(err));

  return (
    <Screen isActive={isActive}>
      <div className={s.wrapper} data-show={partToShow}>
        <section className={s.screenPartWrapper}>
          <FadeInWrapper
            show={partToShow === "overview" && firstQuestion.length > 0}
            delay={1000}
            variant="fade"
          >
            <HighlightBlock header="Question">
              <p>{firstQuestion}</p>
            </HighlightBlock>
          </FadeInWrapper>
          <FadeInWrapper
            className={s.copy}
            show={partToShow === "overview"}
            delay={1000}
            variant="fade"
          >
            {selectedCards.length > 0 ? (
              <CardsOverviewBlock cards={selectedCards} />
            ) : (
              <TextBlock>
                <span>Cards</span> Each card has symbolic meanings that
                represent different aspects of your life, such as relationships,
                career, emotions, and more. As you choose the cards, I will
                interpret the symbols and archetypes to provide you with
                personalized insights and guidance. The cards are not meant to
                predict the future, but rather to offer a fresh perspective on
                your current situation and potential paths forward. My role is
                to be an intuitive guide, and we will work together to explore
                the messages the cards reveal and how they apply to your life.
              </TextBlock>
            )}
          </FadeInWrapper>
        </section>

        <section className={s.screenPartWrapper}>
          <FadeInWrapper show={partToShow === "pulling"} variant="fade">
            <CardsShaker
              partToShow={partToShow}
              selectedCards={selectedCards}
              pickTarotCards={pickTarotCards}
              setPartToShow={setPartToShow}
            />
          </FadeInWrapper>
        </section>
      </div>

      <footer className={s.footer}>
        <FadeInWrapper
          className={s.footerPart}
          show={partToShow === "overview"}
          delay={1000}
          variant="fade"
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
