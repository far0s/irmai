import { useWindowSize } from "usehooks-ts";

export const useIsMobile = (): boolean => {
  const { width } = useWindowSize();
  return width < 769;
};
