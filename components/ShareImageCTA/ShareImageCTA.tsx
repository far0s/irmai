import PressCTA from "@/components/PressCTA/PressCTA";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import shareImage from "@/utils/share-image";

const ShareImageCTA = () => {
  const { firstQuestion, conclusion } = useIrmaiStore((s) => s);

  const handleShareImage = async () => {
    shareImage({
      firstQuestion: firstQuestion || "What is the meaning of life?",
      conclusion: conclusion || "42",
    });
  };

  return <PressCTA onPress={handleShareImage} label="Share my reading" />;
};

export default ShareImageCTA;
