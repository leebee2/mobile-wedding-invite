import { useEffect, useState } from 'react';

const introTitleLines = ["We're", 'getting', 'married'];
const titleText = introTitleLines.join(' ');
const introVisibleDuration = 5200;
const introTypingDuration = 4200;

export default function IntroOverlay({ introImages }) {
  const [introDone, setIntroDone] = useState(false);
  const [introAssetsReady, setIntroAssetsReady] = useState(false);
  const [introHidden, setIntroHidden] = useState(false);
  const [typedText, setTypedText] = useState('');

  const typedIntroLines = (() => {
    let remaining = typedText.length;
    return introTitleLines.map((line, index) => {
      const visibleCount = Math.max(0, Math.min(line.length, remaining));
      const visibleText = line.slice(0, visibleCount);
      remaining -= visibleCount;
      if (index < introTitleLines.length - 1 && remaining > 0) {
        remaining -= 1;
      }
      return visibleText;
    });
  })();

  const lastVisibleIntroLine = Math.max(typedIntroLines.findLastIndex((line) => line.length > 0), 0);

  useEffect(() => {
    let active = true;
    Promise.all(
      introImages.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = src;
          })
      )
    ).then(() => {
      if (active) {
        setIntroAssetsReady(true);
      }
    });

    return () => {
      active = false;
    };
  }, [introImages]);

  useEffect(() => {
    if (introDone || !introAssetsReady) {
      return;
    }

    const hideTimer = setTimeout(() => setIntroHidden(true), introVisibleDuration);
    const doneTimer = setTimeout(() => setIntroDone(true), 6500);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(doneTimer);
    };
  }, [introDone, introAssetsReady]);

  useEffect(() => {
    if (introHidden || !introAssetsReady) {
      return;
    }

    let idx = 0;
    const typingInterval = Math.max(70, Math.floor(introTypingDuration / titleText.length));
    const timer = setInterval(() => {
      idx += 1;
      setTypedText(titleText.slice(0, idx));
      if (idx >= titleText.length) {
        clearInterval(timer);
      }
    }, typingInterval);

    return () => clearInterval(timer);
  }, [introHidden, introAssetsReady]);

  if (introDone || !introAssetsReady) {
    return null;
  }

  return (
    <div className={`intro-overlay ${introHidden ? 'is-hidden' : ''}`} aria-hidden={introHidden}>
      <div className="intro-frame">
        <img className="intro-image intro-image-1" src={introImages[0]} alt="" />
        <img className="intro-image intro-image-2" src={introImages[1]} alt="" />
      </div>
      <div className="intro-copy">
        <h2 className="typewriter">
          {typedIntroLines.map((line, index) => (
            <span key={introTitleLines[index]} className={`typewriter-line typewriter-line-${index + 1}`}>
              <span className="typewriter-line-inner">
                <span className="typewriter-line-ghost" aria-hidden="true">
                  {introTitleLines[index]}
                </span>
                <span className="typewriter-line-text">
                  {line}
                  {index === lastVisibleIntroLine && <span className={`cursor ${introHidden ? 'hidden' : ''}`}>|</span>}
                </span>
              </span>
            </span>
          ))}
        </h2>
      </div>
    </div>
  );
}
