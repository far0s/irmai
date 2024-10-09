"use client";
import Image from "next/image";
import { Drawer } from "vaul";
import Tilt from "react-parallax-tilt";

import Logo from "@/components/Logo/Logo";
import TransitionWrapper from "@/components/TransitionWrapper/TransitionWrapper";

import { ITarotCard } from "@/utils/shared-types";

import s from "./card.module.css";

const CardWithLightbox = ({
  cardContent,
  lightboxContent,
}: {
  cardContent: JSX.Element;
  lightboxContent: JSX.Element;
}) => {
  return (
    <Drawer.Root>
      <Drawer.Trigger>{cardContent}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className={s.drawerOverlay} />
        <div className={s.drawerWindow}>
          <Drawer.Content className={s.drawerContent} aria-describedby="test">
            <Drawer.Description style={{ display: "none" }}>
              Card Overlay
            </Drawer.Description>
            <Drawer.Title style={{ display: "none" }}>
              Card Overlay
            </Drawer.Title>
            {lightboxContent}
          </Drawer.Content>
        </div>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

const Card = ({
  card,
  hidden,
  reverse,
  onClick,
  variant = "default",
  enableLightbox = false,
}: {
  card: ITarotCard;
  hidden: boolean;
  reverse: boolean;
  onClick?: any;
  variant?: "default" | "small";
  enableLightbox?: boolean;
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const cardContent = (
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
    </div>
  );

  const lightboxContent = (
    <div className={s.lightboxContent}>
      <Tilt perspective={1000} trackOnWindow={true} gyroscope={true}>
        <div className={s.card} data-is-hidden={false} data-variant="lightbox">
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
      </Tilt>
    </div>
  );

  if (enableLightbox) {
    return (
      <CardWithLightbox
        cardContent={cardContent}
        lightboxContent={lightboxContent}
      />
    );
  }

  return cardContent;
};

export default Card;
