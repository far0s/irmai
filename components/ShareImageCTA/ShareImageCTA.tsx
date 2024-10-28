import html2canvas from "html2canvas";

import PressCTA from "@/components/PressCTA/PressCTA";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import shareImage from "@/utils/share-image";

const ShareImageCTA = () => {
  const { firstQuestion, conclusion } = useIrmaiStore((s) => s);

  const handleShareImage = async () => {
    const bgCanvas: HTMLCanvasElement | null = document.querySelector("canvas");
    if (!bgCanvas) return window.alert("Error: aura not found");
    const img = await html2canvas(bgCanvas).then((canvas) => {
      return canvas.toDataURL("image/png");
    });

    shareImage({
      firstQuestion: firstQuestion || "What is the meaning of life?",
      conclusion: conclusion || "42",
      auraImage: img,
    });
  };

  return <PressCTA onPress={handleShareImage} label="Share my reading" />;
};

export default ShareImageCTA;
