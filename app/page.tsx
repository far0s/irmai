'use client';

import { useEffect } from 'react';
import { useChat } from 'ai/react';
import Recorder from '@/components/recorder/Recorder';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat();

  // PRIO 1
  // [] speech recorder so people can talk directly to their browser (using browser speech recognition API https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
  // [] speech synthesizer so the browser can talk back (using OpenAI text-to-speech API https://platform.openai.com/docs/guides/text-to-speech)
  // PRIO 2
  // [] custom instructions (the AI should be proficient with astrology, etc.)
  // [] pull tarot cards from https://github.com/ekelen/tarot-api and send them to the AI

  useEffect(() => {
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    console.log(lastMessage);
    if (lastMessage.role === 'assistant') {
      // speakText(lastMessage.content);
    }
  }
}, [messages]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.length > 0
        ? messages.map(m => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === 'user' ? 'User: ' : 'IrmAI: '}
              {m.content}
            </div>
          ))
        : null}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
      <Recorder />
    </div>
  );
}
