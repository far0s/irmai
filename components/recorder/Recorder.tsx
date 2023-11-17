// 'use client';
import { useState, useEffect } from 'react';

declare const window: any;

const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [confidence, setConfidence] = useState<number>();
  const [transcript, setTranscript] = useState<number>();
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    return () => {
      const speechRecognitionList = (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;
      const recog = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new recog();
      const list = new speechRecognitionList();
      recognitionInstance.grammars = list;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.interimResults = true;
      recognitionInstance.continuous = true;
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onstart = function() {
        setIsRecording(true);
        console.log("We are listening. Try speaking into the microphone.");
      };

      recognitionInstance.onend = function() {
        // when user is done speaking
        setIsRecording(false);
        recognitionInstance.stop();
      }

      recognitionInstance.onresult = function(event: any) {
        setTranscript(event.results[0][0].transcript);
        console.log('Transcript: ' + event.results[0][0].transcript);
        setConfidence(event.results[0][0].confidence);
        console.log('Confidence: ' + event.results[0][0].confidence);
      };

      recognitionInstance.onerror = function(event:any) {
        console.log(event.error);
        setIsRecording(false);
      }

      setRecognition(recognitionInstance);

    };
  }, [])

  const startRecording = () => {
    console.log('record');
    (recognition as any)?.start();
  };

  const stopRecording = () => {
    console.log('stop record');
    (recognition as any)?.stop();
  }

  return (
    <div className="fixed bottom-0 w-full max-w-md p-2 mb-20">
      <button className="border border-gray-300 rounded p-2 hover:bg-gray-100" onClick={startRecording}>Record{isRecording ? 'ing...' : ''}</button>
      {isRecording && <button className="border border-gray-300 rounded p-2 hover:bg-gray-100" onClick={stopRecording}>Stop</button>}
    </div>
  )
};

export default Recorder;