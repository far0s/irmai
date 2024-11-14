"use client";
import { useEffect } from "react";

const useScrollToTop = (
  ref: React.RefObject<HTMLDivElement | null>,
  condition?: boolean
) => {
  useEffect(() => {
    condition && ref.current?.scrollIntoView(false);
  }, [condition]);
};

export default useScrollToTop;
