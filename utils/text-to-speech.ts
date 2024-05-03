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
  const audioBuffer = await audioContext.decodeAudioData(
    await whisper.arrayBuffer()
  );
  const audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  audioSource.connect(audioContext.destination);
  audioSource.start();
  audioSource.onended = () => {
    stream.getTracks().forEach((track: any) => track.stop());
    endSpeakCallback();
  };
};

export default convertTextToSpeech;
