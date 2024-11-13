"use client";
import { Suspense, useEffect } from "react";
import Background from "@/components/Background/Background";
import Debug from "@/components/Debug/Debug";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import s from "../page.module.css";

const AuraPage = () => {
  const { setAllCards } = useIrmaiStore((s) => s);

  useEffect(() => {
    fetchAllTarotCards();
  }, []);

  const fetchAllTarotCards = async () =>
    await fetch("/api/tarot?n=50") // FIXME: above 50 cards, the page crashes after we select 3 cards
      .then((res) => res.json())
      .then((data) => setAllCards(data))
      .catch((err) => console.error(err));

  return (
    <main className={s.page}>
      <div className={s.pageContainer}>
        <Background />
        <Suspense fallback={null}>
          <Debug />
        </Suspense>
      </div>
    </main>
  );
};

export default AuraPage;
