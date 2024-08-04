"use server";

import { ERROR_MESSAGES } from "@/helpers/constants/error";
import { CreateChatCompletionRequest } from "openai";

const OPENAI_COMPLETIONS_API_ENDPOINT =
  "https://api.openai.com/v1/chat/completions";

/**
 * This function sends a POST request to the OpenAI completions API endpoint with a payload and returns
 * a ReadableStream of Uint8Array or undefined.
 * @param {CreateChatCompletionRequest} payload - The payload parameter is an object that contains the
 * information needed to generate a chat completion using the OpenAI API. It includes the prompt text,
 * the maximum number of tokens to generate, and other optional parameters such as the temperature and
 * the presence of a stop sequence.
 * @returns The function `getOpenAICompletion` returns a `Promise` that resolves to a `ReadableStream`
 * of `Uint8Array` or `undefined`.
 */
export const getOpenAICompletion = async (
  payload: CreateChatCompletionRequest
): Promise<ReadableStream<Uint8Array> | undefined> => {
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(
      OPENAI_COMPLETIONS_API_ENDPOINT,
      requestOptions
    );
    const statusCode = response.status;

    if (statusCode !== 200) {
      throw new Error(statusCode.toString());
    }

    if (response.ok && response.body) {
      const responseStream = response.body as ReadableStream<Uint8Array>;
      return responseStream;
    }
  } catch (error: any) {
    console.error(`Error getting OpenAI completion: ${error.message}`);
    throw error;
  }
};
