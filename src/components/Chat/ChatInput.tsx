"use client";

import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import {
  FC,
  HTMLAttributes,
  KeyboardEvent,
  useContext,
  useRef,
  useState,
} from "react";
import { nanoid } from "nanoid";
import TextareaAutosize from "react-textarea-autosize";
import { sendMessage } from "@/api";
import { MessagesContext } from "@/context/messages";
import { Message } from "@/lib/validators/message";
import { CornerDownLeft, Loader2 } from "lucide-react";

/**
 *  The `interface ChatInputProps` is defining the props that can be passed to the `ChatInput` component.
 * It extends the `HTMLAttributes<HTMLDivElement>` interface, which means that it inherits all the props that can be passed to a
 * `div` element, such as `className`, `style`, `onClick`, etc.
 * This allows the `ChatInput` component to accept any props that a `div` element can accept, in addition to any custom props that may be defined specifically for the `ChatInput` component.
 */
interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const [input, setInput] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { addMessage, updateMessage, removeMessage, setIsMessageUpdating } =
    useContext(MessagesContext);

  const { mutate, isLoading } = useMutation(sendMessage, {
    onSuccess: async (stream) => {
      if (!stream) {
        throw new Error("No Stream Found");
      }

      setIsMessageUpdating(true);

      const messageId = `message_${nanoid()}`;
      const responseMessage: Message = {
        id: messageId,
        isUserMessage: false,
        text: "",
      };
      addMessage(responseMessage);

      const processStream = async (
        stream: ReadableStreamDefaultReader<Uint8Array>
      ) => {
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await stream.read();

          if (done) {
            break;
          }

          const chunkValue = decoder.decode(value);
          updateMessage(messageId, (prevMessage) => prevMessage + chunkValue);
        }
      };

      if (typeof stream === "string") {
        updateMessage(messageId, (prevMessage) => prevMessage + stream);
      } else {
        const reader = stream.getReader();
        await processStream(reader);
      }

      setIsMessageUpdating(false);

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 10);
    },
    onMutate: (message) => {
      setInput("");
      addMessage(message);
    },
    onError: (_, message) => {
      removeMessage(message.id);
      textareaRef.current?.focus();
    },
  });

  const handleMessageInput = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const isEnterKey = event.key === "Enter";
    const isShiftKey = event.shiftKey;

    if (isEnterKey && !isShiftKey) {
      event.preventDefault();
      const input = event.currentTarget.value.trim();

      if (input !== "") {
        const message = {
          id: `message_${nanoid()}`,
          isUserMessage: true,
          text: input,
        };
        mutate(message);
      }
    }
  };

  return (
    <div {...props} className={cn("border-t border-zinc-300", className)}>
      <div className="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none">
        <TextareaAutosize
          onKeyDown={handleMessageInput}
          rows={2}
          ref={textareaRef}
          maxRows={4}
          placeholder="Write a message..."
          value={input}
          disabled={isLoading}
          onChange={(event) => setInput(event.target.value)}
          className="peer disabled:opacity-50 pr-14 text-black resize-none block w-full border-0 bg-zinc-100 py-1.5 tex-grey-900 focus:ring-0 text-sm sm:leading-6"
          autoFocus
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <kbd className="inline-flex items-center rounded border bg-white border-gray-200 px-1 font-sans text-xs text-gray-400">
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <CornerDownLeft className="w-3 h-3" />
            )}
          </kbd>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
        />
      </div>
    </div>
  );
};

export default ChatInput;
