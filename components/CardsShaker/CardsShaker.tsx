"use client";
import { useEffect, useState } from "react";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import Card from "@/components/Card/Card";

import { ITarotCard } from "@/utils/shared-types";

import s from "./cardsShaker.module.css";

const CardsShaker = ({ show }: { show: boolean }) => {
  const { allCards, setSelectedCards } = useIrmaiStore((s) => s);
  const [randomizedCards, setRandomizedCards] = useState(allCards);
  const [tempSelectedCards, setTempSelectedCards] = useState<any[]>([]);

  useEffect(() => {
    if (show) {
      setTempSelectedCards([]);
      setSelectedCards([]);
    }
  }, [show]);

  useEffect(() => {
    if (allCards?.length > 0) {
      randomizeCards();
    }
  }, [allCards]);

  useEffect(() => {
    if (tempSelectedCards.length === 3) {
      setSelectedCards(tempSelectedCards);
    }
  }, [tempSelectedCards]);

  const randomizeCards = () => {
    if (allCards?.length === 0) return setRandomizedCards([]);
    const cards = allCards.sort(() => Math.random() - 0.5);
    const randomized = cards.map((card) => ({
      ...card,
      reverse: Math.random() < 0.25, // the card has a 25% chance of being reversed
    }));
    return setRandomizedCards(randomized);
  };

  const handleAddCardToTempSelectedCards = (card: ITarotCard) => {
    if (tempSelectedCards.length === 3) return;
    if (tempSelectedCards.includes(card)) return;
    setTempSelectedCards([...tempSelectedCards, card]);
  };

  return (
    <div className={s.cardsShaker}>
      <div className={s.shakerSpace}>
        <div className={s.cardsGrid}>
          {randomizedCards.map((card) => (
            <Card
              key={card.name_short}
              card={card}
              hidden={!tempSelectedCards.includes(card)}
              reverse={card.reverse}
              onClick={() => show && handleAddCardToTempSelectedCards(card)}
            />
          ))}
        </div>
      </div>

      <footer className={s.shakerDock}>
        {tempSelectedCards.length > 0 &&
          tempSelectedCards.map((card: ITarotCard) => (
            <div key={card.name_short} className={s.card}>
              {card.name}
              {card.reverse === true && (
                <>
                  <br /> <span>(reverse)</span>
                </>
              )}
            </div>
          ))}
        <p
          className={s.cardPullInstruction}
          data-show={tempSelectedCards.length === 0}
        >
          <em>Choose three cards</em>
        </p>
      </footer>
    </div>
  );
};

export default CardsShaker;
