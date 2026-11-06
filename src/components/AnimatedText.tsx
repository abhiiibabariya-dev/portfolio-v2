import { useRef, type CSSProperties } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

function Char({
  char,
  range,
  progress,
}: {
  char: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span style={{ position: 'relative' }}>
      {/* invisible placeholder keeps layout stable */}
      <span style={{ opacity: 0 }}>{char}</span>
      <motion.span style={{ position: 'absolute', left: 0, top: 0, opacity }}>{char}</motion.span>
    </span>
  );
}

/**
 * Character-by-character scroll reveal. Each character animates from
 * opacity 0.2 to 1 based on its position in the text relative to the
 * paragraph's scroll progress.
 */
export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(' ');
  const total = text.length;
  let charCursor = 0;

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, wi) => {
        const wordStart = charCursor;
        charCursor += word.length + 1; // +1 for the following space
        return (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split('').map((char, ci) => {
              const index = wordStart + ci;
              return (
                <Char
                  key={ci}
                  char={char}
                  progress={scrollYProgress}
                  range={[index / total, (index + 1) / total]}
                />
              );
            })}
            {wi < words.length - 1 && <span>&nbsp;</span>}
          </span>
        );
      })}
    </p>
  );
}
