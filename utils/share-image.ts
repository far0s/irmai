import { ImageTemplateProps } from "@/utils/shared-types";

type ShareImageProps = {
  isMobile?: boolean;
  successCallback?: any;
  errorCallBack?: any;
};

interface ShareData {
  title: string;
  files: File[];
  url: string;
}

interface PreparedShareData {
  blobImage: Blob;
  shareData: ShareData;
}

const prepareShareData = async (
  image: Response
): Promise<PreparedShareData> => {
  const blobImage = await image.blob();
  const fileName = "irmai.png";
  const filesArray = [
    new File([blobImage], fileName, {
      type: "image/png",
      lastModified: Date.now(),
    }),
  ];

  return {
    blobImage: blobImage,
    shareData: {
      title: fileName,
      files: filesArray,
      url: document.location.origin,
    },
  };
};

async function fetchImageData({
  firstQuestion,
  selectedCards,
  conclusion,
  auraImage,
  errorCallBack,
}: ImageTemplateProps & ShareImageProps): Promise<Response | void> {
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
  return fetchedImage;
}

async function handleShare({
  blobImage,
  shareData,
  isMobile,
  successCallback,
}: PreparedShareData & ShareImageProps): Promise<void> {
  if (isMobile && navigator.canShare) {
    if (navigator.canShare(shareData)) {
      successCallback && successCallback();
      await navigator.share(shareData);
    } else {
      successCallback && successCallback();
      const url = URL.createObjectURL(blobImage);
      window.open(url, "_blank");
    }
  } else {
    successCallback && successCallback();
    const url = URL.createObjectURL(blobImage);
    window.open(url, "_blank");
  }
}

export default async function shareImage({
  firstQuestion,
  selectedCards,
  conclusion,
  auraImage,
  isMobile,
  successCallback,
  errorCallBack,
}: ImageTemplateProps & ShareImageProps): Promise<void> {
  const fetchedImage = await fetchImageData({
    firstQuestion,
    selectedCards,
    conclusion,
    auraImage,
    errorCallBack,
  });
  if (!fetchedImage) return;

  const { blobImage, shareData } = await prepareShareData(fetchedImage);

  await handleShare({
    blobImage,
    shareData,
    isMobile,
    successCallback,
  });
}
