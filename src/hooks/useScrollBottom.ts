import { RefObject, useEffect, useState } from 'react';

export const useScrollBottom = (
  ref: RefObject<HTMLElement>,
  scrollBuffer: number = 1,
): [boolean, () => void] => {
  const [isBottom, setIsBottom] = useState(false);

  function scrollToBottom() {
    ref.current?.scrollTo({
      top: ref.current.scrollHeight,
      left: 0,
    });
  }

  useEffect(() => {
    const element = ref.current;

    function onScroll() {
      if (!element) return;
      setIsBottom(
        !(
          element.scrollTop >=
          element.scrollHeight - element?.offsetHeight - scrollBuffer
        ),
      );
    }

    element?.addEventListener('scroll', onScroll);

    return () => {
      element?.removeEventListener('scroll', onScroll);
    };
  }, [ref]);

  return [isBottom, scrollToBottom];
};
