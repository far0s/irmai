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
  expandable,
}: {
  header: string;
  children?: React.ReactNode;
  expandable?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const handleToggleExpand = () => expandable && setExpanded(!expanded);

  return (
    <article
      className={s.transcriptBlock}
      onClick={handleToggleExpand}
      data-is-expandable={expandable}
      data-expanded={expandable ? expanded : true}
    >
      {header && <header className={s.transcriptHeader}>{header}</header>}
      {children && <div className={s.transcriptHighlight}>{children}</div>}
    </article>
  );
};

export const TextBlock = ({
  header,
  children,
  expandable,
}: {
  header?: string;
  children: React.ReactNode;
  expandable?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const handleToggleExpand = () => expandable && setExpanded(!expanded);

  return (
    <article
      className={s.transcriptBlock}
      onClick={handleToggleExpand}
      data-is-expandable={expandable}
      data-expanded={expandable ? expanded : true}
    >
      {header && header.length > 0 && (
        <header className={s.transcriptHeader}>{header}</header>
      )}
      <div className={s.transcriptBlockText}>{children}</div>
    </article>
  );
};

export const CardsOverviewBlock = ({
  cards,
  expandable,
}: {
  cards: any[];
  expandable?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const handleToggleExpand = () => expandable && setExpanded(!expanded);

  return (
    <article
      className={s.transcriptBlock}
      onClick={handleToggleExpand}
      data-is-expandable={expandable}
      data-expanded={expandable ? expanded : true}
    >
      <header className={s.transcriptHeader}>✳︎ Your cards</header>
      <div className={s.transcriptCards}>
        {cards.map((card: any) => (
          <Card
            key={card.name}
            card={card}
            hidden={false}
            reverse={card.reverse}
            variant="small"
            enableLightbox={true}
          />
        ))}
      </div>
    </article>
  );
};
