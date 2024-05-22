"use client";
import { memo } from "react";

import Card from "@/components/Card/Card";

import { dateDDMMYYYY, timeHHMM } from "@/utils";

import s from "./transcript.module.css";

export const TimeKeeper = memo(() => {
  return (
    <div className={s.timeKeeper}>
      <span className={s.timeDate}>{dateDDMMYYYY()}</span>
      <span className={s.timeTime}>{timeHHMM()}</span>
    </div>
  );
});

export const HighlightBlock = ({
  header,
  children,
}: {
  header: string;
  children?: React.ReactNode;
}) => {
  return (
    <article className={s.transcriptBlock}>
      {header && <header className={s.transcriptHeader}>{header}</header>}
      {children && <div className={s.transcriptHighlight}>{children}</div>}
    </article>
  );
};

export const TextBlock = ({
  header,
  children,
}: {
  header?: string;
  children: React.ReactNode;
}) => {
  return (
    <article className={s.transcriptBlock}>
      {header && header.length > 0 && (
        <header className={s.transcriptHeader}>{header}</header>
      )}
      <p>{children}</p>
    </article>
  );
};

export const CardsOverviewBlock = ({ cards }: { cards: any[] }) => {
  return (
    <article className={s.transcriptBlock}>
      <header className={s.transcriptHeader}>Your cards</header>
      <div className={s.transcriptCards}>
        {cards.map((card: any) => (
          <Card
            key={card.name}
            card={card}
            hidden={false}
            reverse={card.reverse}
            variant="small"
          />
        ))}
      </div>
    </article>
  );
};
