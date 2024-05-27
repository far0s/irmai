"use client";
import { useState, useEffect } from "react";

import Card from "@/components/Card/Card";

import { dateDDMMYYYY, timeHHMM } from "@/utils";

import s from "./transcript.module.css";

export const TimeKeeper = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    setDate(dateDDMMYYYY());
    setTime(timeHHMM());
  }, []);

  return (
    <div className={s.timeKeeper}>
      <span className={s.timeDate}>{date}</span>
      <span className={s.timeTime}>{time}</span>
    </div>
  );
};

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
