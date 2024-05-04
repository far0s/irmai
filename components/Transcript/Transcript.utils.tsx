"use client";
import { dateDDMMYYYY, timeHHMM } from "@/utils";

import s from "./transcript.module.css";

export const TimeKeeper = () => {
  return (
    <div className={s.timeKeeper}>
      <span className={s.timeDate}>{dateDDMMYYYY()}</span>
      <span className={s.timeTime}>{timeHHMM()}</span>
    </div>
  );
};

export const FocusBlock = ({ focus }: { focus: string }) => {
  return focus?.length > 0 ? (
    <article className={s.transcriptBlock}>
      <header className={s.transcriptHeader}>Focus</header>
      <div className={s.transcriptHighlight}>
        <p>{focus}</p>
      </div>
    </article>
  ) : null;
};
