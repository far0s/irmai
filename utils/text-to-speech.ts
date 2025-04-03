import { ChatMessage } from "./shared-types";

interface TextToSpeechProps {
  mediaDevices: MediaDevices;
  message: ChatMessage;
  startSpeakCallback: () => void;
  endSpeakCallback: () => void;
  isMuted?: boolean; // Add the isMuted parameter
}

// Store active audio context and gain node for volume control
let activeAudioContext: AudioContext | null = null;
let activeGainNode: GainNode | null = null;

export const convertTextToSpeech = async ({
  mediaDevices,
  message,
  startSpeakCallback,
  endSpeakCallback,
  isMuted = false, // Default to not muted
}: TextToSpeechProps): Promise<void> => {
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
            (await convertWhisperToAudioSource(
              res,
              endSpeakCallback,
              stream,
              isMuted
            ));
        })
        .catch((error) => {
          console.error(error);
        });
    });
  } else {
    console.error("getUserMedia is not supported");
  }
};

// This function updates the volume based on mute state
export const updateAudioVolume = (isMuted: boolean): void => {
  if (activeGainNode) {
    activeGainNode.gain.value = isMuted ? 0 : 1;
  }
};

const convertWhisperToAudioSource = async (
  whisper: Response,
  endSpeakCallback: () => void,
  stream: MediaStream,
  isMuted: boolean = false
) => {
  // Close any existing audio context
  if (activeAudioContext) {
    try {
      activeAudioContext.close();
    } catch (e) {
      console.error("Error closing previous audio context:", e);
    }
  }

  activeAudioContext = new AudioContext();
  const audioBuffer = await activeAudioContext.decodeAudioData(
    await whisper.arrayBuffer()
  );
  const audioSource = activeAudioContext.createBufferSource();
  audioSource.buffer = audioBuffer;

  // Create a gain node for volume control
  activeGainNode = activeAudioContext.createGain();
  // Set volume based on mute state (0 if muted, 1 if not muted)
  activeGainNode.gain.value = isMuted ? 0 : 1;

  // Connect the source to the gain node, then to the destination
  audioSource.connect(activeGainNode);
  activeGainNode.connect(activeAudioContext.destination);

  audioSource.start();
  audioSource.onended = () => {
    stream.getTracks().forEach((track: any) => track.stop());
    endSpeakCallback();
    // Clean up when finished
    activeGainNode = null;
    if (activeAudioContext) {
      activeAudioContext
        .close()
        .catch((e) => console.error("Error closing audio context:", e));
      activeAudioContext = null;
    }
  };
};

export default convertTextToSpeech;
