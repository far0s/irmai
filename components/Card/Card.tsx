import Image from "next/image";
import { useState } from "react";

import Logo from "@/components/Logo/Logo";
import TransitionWrapper from "../TransitionWrapper/TransitionWrapper";

import { ITarotCard } from "@/utils/shared-types";

import s from "./card.module.css";

const Card = ({
  card,
  hidden,
  reverse,
  onClick,
  variant = "default",
}: {
  card: ITarotCard;
  hidden: boolean;
  reverse: boolean;
  onClick?: () => void;
  variant?: "default" | "small";
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleCardClick = () => {
    if (!hidden) {
      setLightboxOpen(true);
    } else {
      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <>
      <div
        className={s.card}
        data-is-hidden={hidden}
        data-is-reverse={reverse}
        data-variant={variant}
        onClick={handleCardClick}
      >
        <div className={s.cardBack}>
          <Logo />
          <Logo />
        </div>
        <div className={s.cardFront}>
          {card.image && (
            <Image
              src={card.image}
              alt={card.name}
              width={300}
              height={527}
              className={s.cardImage}
              priority
            />
          )}
        </div>

        <TransitionWrapper className={s.cardName} show={!hidden} delay={200}>
          <span>{card.name}</span>
          {reverse === true && <span>(reverse)</span>}
        </TransitionWrapper>
      </div>

      {lightboxOpen && (
        <div className={s.lightbox} onClick={() => setLightboxOpen(false)}>
          <div className={s.lightboxContent}>
            <div
              className={s.card}
              data-is-hidden={false}
              data-variant="lightbox"
            >
              <div className={s.cardBack}>
                <Logo />
                <Logo />
              </div>
              <div className={s.cardFront}>
                {card.image && (
                  <Image
                    src={card.image}
                    alt={card.name}
                    width={300}
                    height={527}
                    className={s.cardImage}
                    priority
                  />
                )}
              </div>

              <TransitionWrapper
                className={s.cardName}
                show={!hidden}
                delay={200}
              >
                <span>{card.name}</span>
                {reverse === true && <span>(reverse)</span>}
              </TransitionWrapper>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
