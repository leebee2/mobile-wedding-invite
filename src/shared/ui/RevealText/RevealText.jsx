import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function RevealText({
  as: Tag = 'p',
  className = '',
  lines = [],
  baseDelay = 0,
  lineClassName = '',
  active = true,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.18 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isInView) {
      setIsReady(true);
    }
  }, [isInView]);

  const shouldReveal = active && isReady;

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, index) => (
        <span key={`${className}-${index}`} className={`reveal-line ${lineClassName}`.trim()}>
          <motion.span
            className="reveal-line-inner"
            initial={{ opacity: 0, y: '115%' }}
            animate={shouldReveal ? { opacity: 1, y: '0%' } : { opacity: 0, y: '115%' }}
            transition={{ duration: 0.68, delay: baseDelay + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
