"use client";
import { CSSProperties } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import Logo from "@/components/Logo/Logo";
import TransitionWrapper from "@/components/TransitionWrapper/TransitionWrapper";
import { useCardDrawer } from "@/components/CardDrawer/CardDrawer";

import { ITarotCard } from "@/utils/shared-types";

import s from "./card.module.css";

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
  const { openDrawer } = useCardDrawer();

  const handleCardClick = () => {
    if (enableLightbox) {
      openDrawer(card);
    } else if (onClick) {
      onClick();
    }
  };

  return (
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
};

export default Card;
