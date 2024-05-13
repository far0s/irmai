import { useEffect, useState, Fragment } from "react";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressCTA from "@/components/PressCTA/PressCTA";
import { CardsOverviewBlock } from "@/components/Transcript/Transcript.utils";
import Card from "@/components/Card/Card";

import { ITarotCard } from "@/utils/shared-types";

import s from "./cardsShaker.module.css";

const CardsShaker = ({
  setPartToShow,
  show,
}: {
  setPartToShow: any;
  show: boolean;
}) => {
  const { allCards, selectedCards, setSelectedCards } = useIrmaiStore((s) => s);
  const [tempSelectedCards, setTempSelectedCards] = useState<ITarotCard[]>([]);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    if (show) {
      setSelectedCards([]);
      setShowReset(true);
    } else {
      setShowReset(false);
    }
  }, [show]);

  // we probably don't need this anymore
  /* const pickTarotCards = async () =>
    await fetch("/api/tarot?n=3")
      .then((res) => res.json())
      .then((data) => setSelectedCards(data))
      .catch((err) => console.error(err)); */

  // TODO:
  // first animate to show all the cards
  // the cards should randomized and turned over
  // each card becomes selectable
  // when selected, it moves to the selected cards section at the bottom
  // when 3 cards are selected, reveal them and show them kinda full screen
  // user can then click to go to the next screen

  return (
    <div className={s.cardsShaker}>
      <div className={s.shakerSpace}>
        <div className={s.cardsGrid}>
          {allCards.map((card) => (
            <Fragment key={card.name_short}>
              <Card
                key={card.name_short}
                card={card}
                hidden={false}
                reverse={false}
                onClick={() => {
                  if (tempSelectedCards.length < 3) {
                    setTempSelectedCards([...tempSelectedCards, card]);
                  }
                }}
              />
            </Fragment>
          ))}
        </div>
      </div>

      <footer className={s.shakerDock}>
        {tempSelectedCards.length > 0 &&
          tempSelectedCards.map((card: ITarotCard) => (
            <div key={card.name_short} className={s.card}>
              {card.name}
            </div>
          ))}
        <p
          className={s.cardPullInstruction}
          data-show={tempSelectedCards.length === 0}
        >
          <em>Choose three cards</em>
        </p>
      </footer>
      {/* <div className={s.cardsContainer}>
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
      </div> */}
    </div>
  );
};

export default CardsShaker;
