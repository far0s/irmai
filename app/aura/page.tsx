"use client";
import { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import s from "../page.module.css";

const Background = dynamic(() => import("@/components/Background/Background"), {
  ssr: false,
});

const Debug = dynamic(() => import("@/components/Debug/Debug"), {
  ssr: false,
});

const AuraPage = () => {
  const { setAllCards } = useIrmaiStore((s) => s);

  useEffect(() => {
    fetchAllTarotCards();
  }, []);

  const fetchAllTarotCards = async () =>
    await fetch("/api/tarot")
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
