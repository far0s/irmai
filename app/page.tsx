'use client';

import { useEffect, useState } from 'react';
import { useChat } from 'ai/react';
import Recorder from '@/components/recorder/Recorder';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat();
  const [tarotCards, setTarotCards] = useState([]);
  const [subject, setSubject] = useState('love life');
  const [voice, setVoice] = useState('nova');
  const [irmaiIsThinking, setIrmaiIsThinking] = useState(false);
  const [irmaiIsSpeaking, setIrmaiIsSpeaking] = useState(false);

  // TASKS:
  // [X] speech synthesizer so the browser can talk back (using OpenAI text-to-speech API https://platform.openai.com/docs/guides/text-to-speech)
  // [X] pull tarot cards from https://github.com/ekelen/tarot-api and send them to the AI
  // [] generate AI images for the tarot cards
  // [] speech recorder so people can talk directly to their browser (using browser speech recognition API https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
  // [] custom instructions (the AI should be proficient with astrology, etc.)

  const pickTarotCards = async () => {
    const response = await fetch('/api/tarot');
    const data = await response.json();
    setTarotCards(data.cards);
  }

  const speakLastMessage = async (message: any) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(async (stream) => {
          setIrmaiIsSpeaking(true);
          const whisper = await fetch('/api/speak', {
            method: 'POST',
            body: JSON.stringify({
              input: message.content,
              voice: voice, // alloy, echo, fable, onyx, nova, and shimmer
            }),
          });

          const audioContext = new AudioContext();
          const audioBuffer = await audioContext.decodeAudioData(await whisper.arrayBuffer());
          const audioSource = audioContext.createBufferSource();
          audioSource.buffer = audioBuffer;
          audioSource.connect(audioContext.destination);
          const gainNode = audioContext.createGain();
          gainNode.gain.value = 0.5;
          audioSource.connect(gainNode);
          gainNode.connect(audioContext.destination);
          audioSource.start();
          audioSource.onended = () => {
            setIrmaiIsSpeaking(false);
          };
        })
        .catch((error) => console.log('Something went wrong!', error));
    } else {
      console.log('getUserMedia is not supported');
    }
  };

  const composeInput = () => {
    // on button click, write a sentence containing the cards' names, and change the inputRef value
    const cards = tarotCards.map((card: any) => card.name);
    const sentence = `Give me a tarot reading about my ${subject}. I pulled the following cards from left to right: ${cards.join(', ')}. Keep your response to a maximum of 50 words.`;
    handleInputChange({ target: { value: sentence } } as any);
  };

  const submitPrompt = (event: any) => {
    setIrmaiIsThinking(true);
    handleSubmit(event);
  }

  useEffect(() => {
    // start a timer for 2 seconds
    // when new messages come in,
    // check if the last message was from the assistant
    // if so, restart the timer
    // if the timer expires, speak the last message out loud
    // if new messages come in, restart the timer
    if (messages.length === 0) return;

    // if the last message was from the assistant, setIrmaiIsThinking(false);
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'assistant') {
      setIrmaiIsThinking(false);
    }

    const timer = setTimeout(() => {
      if (lastMessage.role === 'assistant') {
        speakLastMessage(lastMessage);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div className="flex flex-col w-full max-w-xl py-24 pb-56 mx-auto stretch gap-8">
      {tarotCards.length > 0 && <>
        <div className="w-full block flex-1 text-center">Your cards:</div>
        <div className="flex flex-row justify-center w-full">
          {tarotCards.map((card: any) => (
            <div key={card.name_short} className="flex flex-col items-center justify-center w-1/3 p-4">
              {/* <img src={card.image} className="w-32 h-48" /> */}
              <div className="text-center">{card.name}</div>
            </div>
          ))}
        </div>
      </>}
      {messages.length > 0
        ? messages.map((m, i) => (
            <div key={m.id} className="whitespace-pre-wrap">
              <span className="font-bold">{m.role === 'user' ? 'User: ' : 'IrmAI: '}</span>
              <p>{m.content}</p>
            </div>
          ))
        : null}
      {irmaiIsThinking && (
        <div className="whitespace-pre-wrap">
          <span className="font-bold">IrmAI:</span>
          <p>...</p>
        </div>
      )}
      {messages?.[messages.length - 1]?.role === 'assistant' && irmaiIsSpeaking && (
        <span className="font-bold">Speaking now</span>
      )}

      <div className="fixed bottom-0 w-full max-w-xl p-2 mb-8 flex flex-col gap-2">
          <button onClick={pickTarotCards} className="w-full max-w-xl p-2 border border-gray-300 rounded shadow-xl">
            {tarotCards.length === 0 ? 'Pull three cards' : 'Pick again'}
          </button>
          <form onSubmit={submitPrompt} className="relative flex flex-row align-center">
            <input
              className="w-full p-2 pr-20 border border-gray-300 rounded shadow-xl"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
            {input.length > 5 && <input type="submit" className="absolute right-0 w-30 p-1 m-1 border border-gray-300 rounded shadow-xl cursor z-1" />}
            {input.length === 0 && tarotCards.length > 0 && <button onClick={composeInput} className="absolute right-0 w-30 p-1 m-1 border border-gray-300 rounded shadow-xl cursor z-1">Compose Prompt</button>}
          </form>
      </div>

      <select
        className="fixed top-0 right-0 w-40 p-2 m-2 border border-gray-300 shadow-xl cursor"
        onChange={(event) => setVoice(event.target.value)}
      >
        <option value="Voice" disabled>Voice</option>
        <option value="nova">Nova</option>
        <option value="alloy">Alloy</option>
        <option value="echo">Echo</option>
        <option value="fable">Fable</option>
        <option value="onyx">Onyx</option>
        <option value="shimmer">Shimmer</option>
      </select>
      <select
        className="fixed top-12 right-0 w-40 p-2 m-2 border border-gray-300 shadow-xl cursor"
        onChange={(event) => setSubject(event.target.value)}
      >
        <option value="Subject" disabled>Subject</option>
        <option value="love life">Love life</option>
        <option value="professional career">Professional Career</option>
        <option value="next obsession">Next obsession</option>
        <option value="dinner">Dinner</option>
      </select>
      {/* <Recorder /> */}
    </div>
  );
}
