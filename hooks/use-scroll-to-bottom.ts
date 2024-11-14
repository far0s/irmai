import { useEffect, useRef } from "react";

const useScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const windowHeight = window.innerHeight;
    const elementHeight = elementRef.current?.scrollHeight;
    if (!elementHeight) return;

    return elementRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: elementHeight > windowHeight ? "end" : "start",
    });
  }, [elementRef.current?.scrollHeight]);

  return elementRef;
};

export default useScrollToBottom;
