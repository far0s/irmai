"use client";
import { CSSProperties } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import Logo from "@/components/Logo/Logo";
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

      <motion.div
        className={s.cardName}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: hidden ? 0 : 1,
          y: hidden ? 20 : 0,
        }}
        transition={{
          duration: 0.3,
          delay: !hidden ? 0.3 : 0,
          ease: "easeOut",
        }}
      >
        <span>{card.name}</span>
        {reverse === true && <span>(reverse)</span>}
      </motion.div>
    </motion.div>
  );
};

export default Card;
