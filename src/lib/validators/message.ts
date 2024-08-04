import { array, boolean, infer as ZodInfer, object, string } from "zod";

export const MessageSchema = object({
  id: string(),
  text: string(),
  isUserMessage: boolean(),
});

//? Array Validator
export const MessageArraySchema = array(MessageSchema);

export type Message = ZodInfer<typeof MessageSchema>;
