"use client";
import { useEffect, useState } from "react";

import { filteredTranscript } from "@/utils";
import { ChatMessage } from "@/utils/shared-types";

const useTranscript = (messages: ChatMessage[]) => {
  const [transcript, setTranscript] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (messages && messages.length > 1) {
      setTranscript(filteredTranscript(messages));
    }
  }, [messages]);

  return transcript;
};

export default useTranscript;
