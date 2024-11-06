import { ImageTemplateProps } from "@/utils/shared-types";

type ShareImageProps = {
  isMobile?: boolean;
  successCallback?: any;
  errorCallBack?: any;
};

export default async function shareImage({
  firstQuestion,
  selectedCards,
  conclusion,
  auraImage,
  isMobile,
  successCallback,
  errorCallBack,
}: ImageTemplateProps & ShareImageProps): Promise<void> {
  const fetchedImage = await fetch("/api/dynamic-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstQuestion: firstQuestion,
      selectedCards: selectedCards,
      conclusion: conclusion,
      auraImage: auraImage,
    }),
  }).catch(() => errorCallBack && errorCallBack());
  if (!fetchedImage) return errorCallBack && errorCallBack();

  const blobImage = await fetchedImage.blob();
  const fileName = "irmai.png";
  const filesArray = [
    new File([blobImage], fileName, {
      type: "image/png",
      lastModified: Date.now(),
    }),
  ];

  const shareData = {
    title: fileName,
    files: filesArray,
    url: document.location.origin,
  };

  if (isMobile && navigator.canShare) {
    if (navigator.canShare(shareData)) {
      successCallback && successCallback();
      await navigator.share(shareData);
    }
  } else {
    successCallback && successCallback();
    const url = URL.createObjectURL(blobImage);
    window.open(url, "_blank");
  }
}
