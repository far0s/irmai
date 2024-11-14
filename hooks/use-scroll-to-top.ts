"use client";
import { useEffect } from "react";

const useScrollToTop = (
  ref: React.RefObject<HTMLDivElement | null>,
  condition?: boolean
) => {
  useEffect(() => {
    const isTranscript = ref.current?.classList.contains("transcriptInner");
    condition &&
      ref.current?.scrollTo({
        top: isTranscript ? 16 : 48,
        left: 0,
      });
  }, [condition]);
};

export default useScrollToTop;
