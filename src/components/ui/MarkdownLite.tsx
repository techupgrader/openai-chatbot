import React, { FC, Fragment } from "react";

interface MarkdownLiteProps {
  text: string;
}

/**
 * The MarkdownLite function takes in a text string and returns a React component that replaces links
in the text with clickable Next Link tags.
 * @param  - The code defines a React functional component called `MarkdownLite` that takes in a single
 * prop called `text` of type string. 
 * @returns The `MarkdownLite` component is being returned, which takes in a `text` prop and uses
 * regular expressions to find links in the text and replace them with `Link` tags. The resulting parts
 * are stored in an array and rendered using a `Fragment`.
 */
const MarkdownLite: FC<MarkdownLiteProps> = ({ text }) => {
  // Regular expression to match links in the text
  const linkRegex = /\[(.+?)\]\((.+?)\)/g;

  // Array to store the parts of the text
  const parts: React.ReactNode[] = [];

  // Track the last index and iterate through matches
  let lastIndex = 0;
  // First regexmatch
  let match = linkRegex.exec(text);

  while (match !== null) {
    // [[],[],[]]
    const [fullMatch, linkText, linkUrl] = match;
    // The index where the match has been started
    const matchStart = match.index;
    // The index where the match has been ended
    const matchEnd = fullMatch.length + matchStart;

    // Push the text before the link to the parts array
    if (lastIndex < matchStart) {
      // i.e: The part where the link is present will be undefined
      parts.push(text.slice(lastIndex, matchStart));
    }

    // Push the link to the parts array
    // Replacing the undefined part of the array with the NextLink
    parts.push(
      <a
        key={linkUrl}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="break-words underline underline-offset-2 text-blue-600"
      >
        {linkText}
      </a>
    );

    // Update the last index
    lastIndex = matchEnd;
    // Find the next match
    match = linkRegex.exec(text);
  }

  // Push the remaining text to the parts array
  // Check if the text that doesn't have the link
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // Render the MarkdownLite component
  return <Fragment>{parts}</Fragment>;
};

export default MarkdownLite;
