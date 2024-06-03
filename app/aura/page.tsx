"use client";
import Background from "@/components/Background/Background";

import s from "../page.module.css";

const AuraPage = () => {
  return (
    <main className={s.page}>
      <div className={s.pageContainer}>
        <Background />
      </div>
    </main>
  );
};

export default AuraPage;
