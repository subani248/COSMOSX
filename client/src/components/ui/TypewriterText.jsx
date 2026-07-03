import { useState, useEffect, useRef } from 'react';

export default function TypewriterText({ text, speed = 20, onComplete }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    startTimeRef.current = Date.now();

    let frame;
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const charsToShow = Math.min(Math.floor(elapsed / speed), text.length);

      if (charsToShow > indexRef.current) {
        indexRef.current = charsToShow;
        setDisplayed(text.slice(0, charsToShow));
      }

      if (indexRef.current < text.length) {
        frame = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [text, speed, onComplete]);

  return (
    <span className="whitespace-pre-wrap">
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-neon-blue ml-0.5 animate-pulse align-text-bottom" />
      )}
    </span>
  );
}
