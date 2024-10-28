import { ImageTemplateProps } from "@/utils/shared-types";

export default async function shareImage({
  firstQuestion,
  conclusion,
  auraImage,
}: ImageTemplateProps): Promise<void> {
  const fetchedImage = await fetch("/api/dynamic-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstQuestion: firstQuestion,
      conclusion: conclusion,
      auraImage: auraImage,
    }),
  });
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

  if (navigator.canShare && navigator.canShare(shareData)) {
    await navigator.share(shareData);
  } else {
    const url = URL.createObjectURL(blobImage);
    window.open(url, "_blank");
  }
}
