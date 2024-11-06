import html2canvas from "html2canvas";
import { useState } from "react";

import PressCTA from "@/components/PressCTA/PressCTA";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import { useIsMobile } from "@/hooks/use-is-mobile";

import shareImage from "@/utils/share-image";

const ShareImageCTA = () => {
  const { firstQuestion, selectedCards, conclusion } = useIrmaiStore((s) => s);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const successCallback = () => {
    setIsLoading(false);
  };

  const errorCallBack = () => {
    window.alert("Error: could not create an image of your reading");
    setIsLoading(false);
  };

  const handleShareImage = async () => {
    setIsLoading(true);
    const bgCanvas: HTMLCanvasElement | null = document.querySelector("canvas");
    if (!bgCanvas) return window.alert("Error: aura not found");
    const img = await html2canvas(bgCanvas)
      .then((canvas) => canvas.toDataURL("image/png"))
      .catch(() => {
        window.alert("Error: could not create an image of your reading");
        setIsLoading(false);
      });

    img &&
      shareImage({
        firstQuestion: firstQuestion || "What is the meaning of life?",
        selectedCards: selectedCards || [],
        conclusion: conclusion || "42",
        auraImage: img,
        isMobile,
        successCallback,
        errorCallBack,
      });
  };

  return (
    <PressCTA
      onPress={handleShareImage}
      label={isLoading ? "Creating image..." : "Share my reading"}
    />
  );
};

export default ShareImageCTA;
