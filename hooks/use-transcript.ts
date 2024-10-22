"use client";
import { useEffect, useState, useCallback } from "react";

import { filteredTranscript } from "@/utils";
import { ChatMessage } from "@/utils/shared-types";

const TIMER_DELAY = 80;

const useTranscript = (
  messages: ChatMessage[],
  lastMessage: ChatMessage | null
) => {
  const [transcript, setTranscript] = useState<ChatMessage[]>([]);
  const [currentMessageBeingAdded, setCurrentMessageBeingAdded] =
    useState<ChatMessage | null>(null);

  const addUserMessageToTranscript = useCallback((message: ChatMessage) => {
    setTranscript((prevTranscript) => {
      // if last message has same id and content, don't add it
      if (
        prevTranscript.length > 0 &&
        prevTranscript[prevTranscript.length - 1].id === message.id &&
        prevTranscript[prevTranscript.length - 1].content === message.content
      ) {
        return filteredTranscript(prevTranscript);
      }
      return filteredTranscript([...prevTranscript, message]);
    });
  }, []);

  const progressivelyAddMessageToTranscript = useCallback(
    (message: ChatMessage) => {
      setTranscript((prevTranscript) => {
        // if last message in prevTranscript is from user, leave it there
        if (
          prevTranscript.length > 0 &&
          prevTranscript[prevTranscript.length - 1].role === "user"
        ) {
          return filteredTranscript([...prevTranscript, message]);
        }
        return filteredTranscript([...prevTranscript.slice(0, -1), message]);
      });
    },
    []
  );

  useEffect(() => {
    if (!messages || messages.length === 0) return;
    if (!lastMessage) return;
    if (lastMessage.role === "user") {
      addUserMessageToTranscript(lastMessage);
      return;
    }

    const words = lastMessage.content.split(" ");
    let msg = "";
    let timer = 0;

    setCurrentMessageBeingAdded({
      id: lastMessage.id,
      role: "assistant",
      content: " ",
    });

    words.forEach((word, index) => {
      setTimeout(() => {
        msg += word + " ";
        setCurrentMessageBeingAdded({
          id: lastMessage.id,
          role: "assistant",
          content: msg,
        });

        if (index === words.length - 1) {
          setTimeout(() => {
            setCurrentMessageBeingAdded(null);
          }, TIMER_DELAY);
        }
      }, timer);
      timer += TIMER_DELAY;
    });
  }, [messages, lastMessage]);

  useEffect(() => {
    if (currentMessageBeingAdded) {
      progressivelyAddMessageToTranscript(currentMessageBeingAdded);
    }
  }, [currentMessageBeingAdded]);

  return transcript;
};

export default useTranscript;
