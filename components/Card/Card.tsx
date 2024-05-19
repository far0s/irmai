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
      <div className={s.cardBack}>
        <Logo />
        <Logo />
      </div>
      <div className={s.cardFront}>
        {card.image && (
          <img src={card.image} alt={card.name} className={s.cardImage} />
        )}
        <p>
          {card.name}{" "}
          {reverse === true && (
            <>
              <br /> <span>(reverse)</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Card;
