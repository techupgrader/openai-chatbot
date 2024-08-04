"use client";

import { Message } from "@/lib/validators/message";
import { nanoid } from "nanoid";
import { ReactNode, createContext, useState } from "react";

export interface MessagesContext {
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (
    messageId: Message["id"],
    updateFn: (prevText: string) => string
  ) => void;
  removeMessage: (messageId: Message["id"]) => void;
  isMessageUpdating: boolean;
  setIsMessageUpdating: (isUpdating: boolean) => void;
}

export const MessagesContext = createContext<MessagesContext>({
  messages: [],
  addMessage: () => {},
  updateMessage: () => {},
  removeMessage: () => {},
  isMessageUpdating: false,
  setIsMessageUpdating: () => {},
});

interface MessageProviderProps {
  children: ReactNode;
}

const MessagesProvider = ({ children }: MessageProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: `message_${nanoid()}`,
      text: "Hello, how can I help you?",
      isUserMessage: false,
    },
  ]);
  const [isMessageUpdating, setIsMessageUpdating] = useState<boolean>(false);
  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };
  const removeMessage = (messageId: Message["id"]) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.filter(
        (message) => message.id !== messageId
      );
      return updatedMessages;
    });
  };
  const updateMessage = (
    messageId: Message["id"],
    updateFn: (prevText: string) => string
  ) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((message) => {
        if (message.id === messageId) {
          return { ...message, text: updateFn(message.text) };
        }
        return message;
      });
      return updatedMessages;
    });
  };
  const value = {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
    isMessageUpdating,
    setIsMessageUpdating,
  };
  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

export default MessagesProvider;
