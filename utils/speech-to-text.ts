export const convertSpeechToText = async ({
  audioFile,
  errorCallback,
  successCallback,
}: {
  audioFile: any;
  errorCallback?: (error: any) => void;
  successCallback: (data: any) => void;
}) => {
  const formData = new FormData();
  formData.append("file", audioFile);

  return await fetch("/api/speech-to-text", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .catch((error) => errorCallback?.(error) || console.error(error))
    .then((data) => successCallback(data));
};

export default convertSpeechToText;
