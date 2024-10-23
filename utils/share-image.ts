export default async function shareImage(imageUrl: string): Promise<void> {
  const fetchedImage = await fetch(imageUrl);
  const blobImage = await fetchedImage.blob();
  const fileName = "irmai.jpg";
  const filesArray = [
    new File([blobImage], fileName, {
      type: "image/jpg",
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
  }
  // TODO: implements a fallback to download the file
}
