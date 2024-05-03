import { useEffect, useState } from "react";

import { cirka } from "@/utils/fonts";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressCTA from "@/components/PressCTA/PressCTA";
import { Screen } from "@/components/Stage/Stage";

import s from "./screens.module.css";

type TPartToShow = null | "start" | "pulling" | "result";

const TarotScreen = ({ isActive, id }: { isActive: boolean; id: string }) => {
  const { setGlobalState, focus, selectedCards, setSelectedCards } =
    useIrmaiStore((s) => s);
  const [partToShow, setPartToShow] = useState<TPartToShow>(null);
  const [showCardsCopy, setShowCardsCopy] = useState<boolean>(false);

  // TODO: make irmai talk about the cards
  // TODO: animate the card shuffling + shaking motion

  useEffect(() => {
    isActive && setPartToShow("start");

    const timeout = setTimeout(() => {
      setShowCardsCopy(true);
    }, 2000);

    return () => {
      clearTimeout(timeout);
      setShowCardsCopy(false);
      setPartToShow("start");
    };
  }, [isActive]);

  const pickTarotCards = async () =>
    await fetch("/api/tarot")
      .then((res) => res.json())
      .then((data) => setSelectedCards(data))
      .catch((err) => console.error(err));

  return (
    <Screen id={id} isActive={isActive}>
      <div className={s.wrapper} data-show={partToShow}>
        <article
          className={s.transcriptBlock}
          data-show={partToShow === "start" || partToShow === "result"}
        >
          <header className={`${cirka.className} ${s.transcriptHeader}`}>
            Focus
          </header>
          {focus?.length > 0 && partToShow !== "result" && (
            <div className={s.transcriptHighlight}>
              <p>{focus}</p>
            </div>
          )}
        </article>

        <article className={s.transcriptBlock} data-show={showCardsCopy}>
          {partToShow === "result" ? (
            <>
              <header className={`${cirka.className} ${s.transcriptHeader}`}>
                Cards
              </header>
              <div className={s.transcriptCards}>
                {selectedCards.map((card) => (
                  <div key={card.name_short} className={s.transcriptCard}>
                    <div className={s.transcriptCardPicture}></div>
                    <p className={s.transcriptCardTitle}>{card.name}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>
              <span className={`${cirka.className}`}>Cards</span> Each card has
              symbolic meanings that represent different aspects of your life,
              such as relationships, career, emotions, and more. As you choose
              the cards, I will interpret the symbols and archetypes to provide
              you with personalized insights and guidance. The cards are not
              meant to predict the future, but rather to offer a fresh
              perspective on your current situation and potential paths forward.
              My role is to be an intuitive guide, and we will work together to
              explore the messages the cards reveal and how they apply to your
              life.
            </p>
          )}
        </article>

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
                <div className={s.transcriptCards}>
                  {selectedCards.map((card) => (
                    <div key={card.name_short} className={s.transcriptCard}>
                      <div className={s.transcriptCardPicture}></div>
                      <p className={s.transcriptCardTitle}>{card.name}</p>
                    </div>
                  ))}
                </div>
                <PressCTA
                  onPress={() => {
                    setShowCardsCopy(true);
                    setPartToShow("result");
                  }}
                  label="go to results"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {selectedCards.length === 0 ? (
        <PressCTA
          onPress={() => {
            setPartToShow("pulling");
            setShowCardsCopy(false);
          }}
        />
      ) : (
        <PressCTA
          onPress={() => {
            setShowCardsCopy(true);
            setSelectedCards([]);
            setPartToShow("start");
          }}
          label="reset"
        />
      )}

      {partToShow === "result" && (
        <PressCTA onPress={() => setGlobalState("question")} label="Next" />
      )}
    </Screen>
  );
};

export default TarotScreen;
