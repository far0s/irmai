import Logo from "@/components/Logo/Logo";

import { ITarotCard } from "@/utils/shared-types";

import s from "./card.module.css";

const Card = ({
  card,
  hidden,
  reverse,
  onClick,
}: {
  card: ITarotCard;
  hidden: boolean;
  reverse: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className={s.card}
      data-is-hidden={hidden}
      data-is-reverse={reverse}
      onClick={onClick}
    >
      {/* a card has a backface with the irmai logo shown in both vertical directions */}
      <div className={s.cardBack}>
        <Logo />
        <Logo />
      </div>
      {/* and a front face showing an image */}
      <div className={s.cardFront}>
        <img
          src={card.image || null}
          alt={card.name}
          className={s.cardImage}
          data-hidden={hidden}
          data-reverse={reverse}
        />
      </div>
    </div>
  );
};

export default Card;
