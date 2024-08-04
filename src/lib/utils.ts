import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * This is a TypeScript function that merges multiple class values into a single string using the
 * `clsx` and `twMerge` functions.
 * @param {ClassValue[]} inputs - `inputs` is a rest parameter that allows the function to accept any
 * number of arguments. In this case, the arguments are of type `ClassValue[]`, which means an array of
 * strings or objects that represent CSS classes. The function then uses the `clsx` utility function to
 * merge these class
 * @returns The `cn` function is returning the result of calling `twMerge` on the output of `clsx` with
 * the spread `inputs` array as its argument.
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
