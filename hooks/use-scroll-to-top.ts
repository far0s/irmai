"use client";
import { useEffect } from "react";

const useScrollToTop = (ref: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    ref.current?.scrollTo(0, 0);
  }, []);
};

export default useScrollToTop;
