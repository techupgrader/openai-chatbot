import { MessagesContext } from "@/context/messages";
import { FC, HTMLAttributes, useContext } from "react";
import { cn } from "@/lib/utils";
import MarkdownLite from "../ui/MarkdownLite";

interface ChatMessagesProps extends HTMLAttributes<HTMLDivElement> {}

const ChatMessages: FC<ChatMessagesProps> = ({ className, ...props }) => {
  const { messages } = useContext(MessagesContext);
  const invertMessages = [...messages].reverse();

  return (
    <div
      {...props}
      className={cn(
        "flex flex-col-reverse overflow-y-auto scrollbar-thumb-rounded scrollbar-track-blue-lighterscroll-bar-w-2 scrolling-touch",
        className
      )}
    >
      <div className="flex-1 flex-grow"></div>
      {invertMessages.map((message) => {
        return (
          <div key={message.id} className="chat-message">
            <div
              className={cn("flex items-end", {
                "justify-end": message.isUserMessage,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-sm max-w-xs mx-2 my-2 overflow-x-hidden rounded-lg",
                  {
                    "bg-blue-600 text-white": message.isUserMessage,
                    "bg-gray-200 text-gray-900": !message.isUserMessage,
                  }
                )}
              >
                <p
                  className={cn("px-4 py-2 rounded-lg", {
                    "bg-blue-600 text-white": message.isUserMessage,
                    "bg-gray-200 text-gray-900": !message.isUserMessage,
                  })}
                >
                  <MarkdownLite text={message.text} />
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
