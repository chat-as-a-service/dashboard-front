import React from 'react';
import { observer } from 'mobx-react-lite';
import { sanitize } from 'dompurify';

export const Linkify = observer(({ children }: { children: string }) => {
  const isUrl = (text: string) => {
    const urlPattern =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    return text.match(urlPattern);
  };

  const addMarkup = (word: string) => {
    return isUrl(word) ? `<a href='${word}' target='_blank'>${word}</a>` : word;
  };

  const words = children?.split(' ') ?? [];
  const formattedWords = words.map((w) => addMarkup(w));
  const html = formattedWords.join(' ');
  return <span dangerouslySetInnerHTML={{ __html: sanitize(html) }} />;
});
