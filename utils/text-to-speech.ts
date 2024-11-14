import { ChatMessage } from "./shared-types";

export const convertTextToSpeech = async ({
  mediaDevices,
  message,
  startSpeakCallback,
  endSpeakCallback,
}: {
  mediaDevices: MediaDevices;
  message: ChatMessage;
  startSpeakCallback: () => void;
  endSpeakCallback: () => void;
}) => {
  if (mediaDevices && mediaDevices.getUserMedia) {
    mediaDevices.getUserMedia({ audio: true }).then(async (stream) => {
      await fetch("/api/text-to-speech", {
        method: "POST",
        body: JSON.stringify({
          input: message.content,
          voice: "nova", // alloy, echo, fable, onyx, nova, and shimmer
        }),
      })
        .then((res) => {
          startSpeakCallback();
          return res;
        })
        .catch((error) => {
          console.error(error);
        })
        .then(async (res) => {
          res &&
            (await convertWhisperToAudioSource(res, endSpeakCallback, stream));
        })
        .catch((error) => {
          console.error(error);
        });
    });
  } else {
    console.error("getUserMedia is not supported");
  }
};

const convertWhisperToAudioSource = async (
  whisper: Response,
  endSpeakCallback: () => void,
  stream: MediaStream
) => {
  const audioContext = new AudioContext();
  const audioElement = document.createElement("audio");
  const gainNode = audioContext.createGain();
  audioElement.src = URL.createObjectURL(await whisper.blob());
  const source = audioContext.createMediaElementSource(audioElement);
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  audioElement.play();

  audioElement.addEventListener("input", (event) => {
    gainNode.gain.value = (event.target as any).value;
  });

  audioElement.onended = () => {
    stream.getTracks().forEach((track: any) => track.stop());
    endSpeakCallback();
  };
};

export default convertTextToSpeech;
