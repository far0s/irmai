import { useEffect, useRef } from "react";

const useScrollToBottom = ({
  readyToScroll = true,
}: {
  readyToScroll: boolean;
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!readyToScroll) return;
    const windowHeight = window.innerHeight;
    const elementHeight = elementRef.current?.scrollHeight;
    if (!elementHeight) return;

    elementRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: elementHeight <= windowHeight ? "start" : "end",
    });
  }, [elementRef.current?.scrollHeight]);

  return elementRef;
};

export default useScrollToBottom;
