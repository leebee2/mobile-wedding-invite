import { useEffect, useState } from 'react';

function getCountdownParts(weddingDateTime) {
  const now = new Date();
  const diffMs = Math.max(0, weddingDateTime.getTime() - now.getTime());
  const totalSec = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds };
}

export default function useCountdown(weddingDateTime) {
  const [countdown, setCountdown] = useState(() => getCountdownParts(weddingDateTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdownParts(weddingDateTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDateTime]);

  return countdown;
}
