"use client";
import { useEffect, useState, memo, useMemo } from "react";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import Card from "@/components/Card/Card";
import { ITarotCard } from "@/utils/shared-types";
import CardStack from "./cardStack";
import s from "./cardsShaker.module.css";

const CardsShaker = ({
  show,
  tempSelectedCards,
  setTempSelectedCards,
}: {
  show: boolean;
  tempSelectedCards: any[];
  setTempSelectedCards: any;
}) => {
  const allCards = useIrmaiStore((s) => s.allCards);
  const setSelectedCards = useIrmaiStore((s) => s.setSelectedCards);
  const setAuraColors = useIrmaiStore((s) => s.setAuraColors);
  const auraColors = useIrmaiStore((s) => s.auraColors);

  const [randomizedCards, setRandomizedCards] = useState(allCards);
  const [cardStack, setCardStack] = useState<any>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  useEffect(() => {
    if (show) {
      setTempSelectedCards([]);
      setSelectedCards([]);
    }
  }, [show]);

  useEffect(() => {
    if (show && allCards?.length > 0) {
      randomizeCards();
    }
  }, [show, allCards]);

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
    setRandomizedCards(randomized);
    initCardStack();
  };

  const initCardStack = () => {
    setCardStack(true);
    window.setTimeout(() => {
      setCardStack(new CardStack());
    }, 500);
    window.addEventListener("beforeunload", () => cardStack?.destroy());
  };

  const handleAddCardToTempSelectedCards = (card: ITarotCard) => {
    if (!show) return;
    if (tempSelectedCards.length === 3) return;
    const newTempSelectedCards = [...tempSelectedCards, card];
    setTempSelectedCards(newTempSelectedCards);

    // Set the colors for the Aura shader
    if (newTempSelectedCards.length === 1) {
      setAuraColors({ ...auraColors, startColor: card.color });
    } else if (newTempSelectedCards.length === 2) {
      setAuraColors({ midColor: card.color });
    } else if (newTempSelectedCards.length === 3) {
      setAuraColors({ ...auraColors, endColor: card.color });
    }
  };

  const handleMouseEnter = (index: number) => setHoveredCardIndex(index);
  const handleMouseLeave = () => setHoveredCardIndex(null);

  useEffect(() => {
    const handleBeforeUnload = () => cardStack?.destroy();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cardStack]);

  // Memoize card elements to prevent unnecessary re-renders
  const cardElements = useMemo(
    () =>
      randomizedCards.map((card) => (
        <Card
          key={card.name_short}
          card={card}
          hidden={!tempSelectedCards.includes(card)}
          reverse={card.reverse}
          isHovered={hoveredCardIndex === randomizedCards.indexOf(card)}
        />
      )),
    [randomizedCards, tempSelectedCards, hoveredCardIndex]
  );

  return (
    <div className={s.cardsShaker}>
      <div className={s.shakerSpace}>
        <div className={s.scrollableContainer} id="scrollable-container">
          {randomizedCards.map((card, i) => (
            <div
              key={card.name_short}
              className="scrollable-card"
              {...(tempSelectedCards.includes(card) && {
                "data-is-selected": true,
              })}
              onClick={() =>
                !tempSelectedCards.includes(card) &&
                handleAddCardToTempSelectedCards(card)
              }
              onMouseEnter={() =>
                !tempSelectedCards.includes(card) && handleMouseEnter(i)
              }
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>
        <div className={s.cardsGrid} id="visible-cards-container">
          {cardElements}
        </div>
      </div>
    </div>
  );
};

export default memo(CardsShaker);
