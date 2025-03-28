"use client";
import { CSSProperties } from "react";
import Image from "next/image";
import { Drawer } from "vaul";
import Tilt from "react-parallax-tilt";
import { motion } from "motion/react";

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
  // FIXME: drawer trigger stays active after closing the drawer
  // on mobile
  // (and blocks the transcript overlay somehow)
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
  isHovered,
}: {
  card: ITarotCard;
  hidden: boolean;
  reverse: boolean;
  onClick?: any;
  variant?: "default" | "small";
  enableLightbox?: boolean;
  isHovered?: boolean;
}) => {
  const handleCardClick = () => onClick && onClick();

  const cardContent = (
    <motion.div
      className={s.card}
      data-is-hidden={hidden}
      data-is-reverse={reverse}
      data-variant={variant}
      data-is-hovered={isHovered}
      onClick={handleCardClick}
      whileHover={{ scale: 1.05 }}
      style={
        {
          "--card-color": card.color || "var(--purple)",
        } as CSSProperties
      }
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
    </motion.div>
  );

  const lightboxContent = (
    <div className={s.lightboxContent}>
      <Tilt
        tiltEnable={true}
        tiltReverse={true}
        tiltAngleXInitial={0}
        tiltAngleYInitial={0}
        tiltMaxAngleX={35}
        tiltMaxAngleY={35}
        perspective={2000}
        trackOnWindow={true}
        transitionSpeed={2000}
        gyroscope={false}
        // FIXME:  on mobile, on enter, the card's gamma/beta values should be normalized
        // see github discussion here: https://github.com/mkosir/react-parallax-tilt/discussions/75
        glareEnable={true}
        glareMaxOpacity={0.5}
        glareColor={reverse ? "#0b0216" : "#fffbf2"}
        glarePosition="all"
        glareBorderRadius="1rem"
        glareReverse={true}
      >
        <div
          className={s.card}
          data-is-hidden={false}
          data-is-reverse={reverse}
          data-variant="lightbox"
          style={
            { "--card-color": card.color || "var(--purple)" } as CSSProperties
          }
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
      </Tilt>
      <TransitionWrapper className={s.cardName} show={!hidden} delay={200}>
        <span>{card.name}</span>
        {reverse === true && <span>(reverse)</span>}
      </TransitionWrapper>
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
