"use client";
import { useEffect } from "react";

const useScrollToTop = (ref: React.RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    ref.current?.scrollTo(0, 0);
  }, []);
};

export default useScrollToTop;
