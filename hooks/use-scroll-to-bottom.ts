import { useEffect, useRef } from "react";

const useScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return elementRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [elementRef.current?.scrollHeight]);

  return elementRef;
};

export default useScrollToBottom;
