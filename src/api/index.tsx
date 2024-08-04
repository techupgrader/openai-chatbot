import { Message } from "@/lib/validators/message";
import { ERROR_MESSAGES } from "@/helpers/constants/error";

const base = process.env.NEXT_PUBLIC_API_ENDPOINT;

const CHAT_API_ENDPOINT = `${base}/api/message`;

/**
 * This function sends a message payload to a chat API endpoint and returns a promise that resolves to
 * a readable stream of bytes, a string, or null.
 * @param {Message} payload - The payload parameter is an object of type Message, which contains the
 * information about the message being sent.
 * @returns The function `sendMessage` returns a `Promise` that resolves to either a
 * `ReadableStream<Uint8Array>`, a string, or `null`. The `ReadableStream<Uint8Array>` is the response
 * body from the API call if the response is successful. If there is an error, either a string error
 * message or `null` is returned.
 */
export const sendMessage = async (
  payload: Message
): Promise<ReadableStream<Uint8Array> | string | null> => {
  try {
    const response = await fetch(CHAT_API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ messages: [payload] }),
    });

    if (response.status in ERROR_MESSAGES) {
      console.log(ERROR_MESSAGES[response.status]);
      throw new Error(ERROR_MESSAGES[response.status]);
    }
    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
    return response.body;
  } catch (error: any) {
    console.error(`Error sending message: ${error}`);
    return error.message;
  }
};
