import { useEffect, useRef, useState } from 'react';
import 'react-day-picker/style.css';
import {
  CalendarSection,
  GallerySection,
  GuestbookSection,
  HeartNoteSection,
  HeroSection,
  IntroOverlay,
  InvitationSection,
  LocationSection,
  ShareSection,
} from '../sections';
import {
  archImage,
  bgmSrc,
  galleryImages,
  galleryPreviewCount,
  introImages,
  kakaoAppKey,
  supabase,
  transferGroups,
  weddingDate,
  weddingDateTime,
  sectionMotion,
} from '../config';
import { useCountdown } from '../sections/hooks';
import { usePreventImageActions, useScrollTopVisibility, useSectionTracking } from '../shared/hooks';

function App() {
  const countdown = useCountdown(weddingDateTime);
  const { activeSection, revealedSections } = useSectionTracking();
  const [toastMessage, setToastMessage] = useState('');
  const [bgmPlaying, setBgmPlaying] = useState(false);
  const showScrollTop = useScrollTopVisibility();
  const audioRef = useRef(null);
  const userPausedRef = useRef(false);

  usePreventImageActions();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = archImage;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.volume = 0.35;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    // Refresh/first-entry should always re-attempt autoplay from a clean state.
    userPausedRef.current = false;
    audio.autoplay = true;

    let cancelled = false;
    const playWithSound = async () => {
      audio.muted = false;
      try {
        await audio.play();
        if (!cancelled) {
          setBgmPlaying(true);
        }
        return true;
      } catch {
        return false;
      }
    };

    const playMutedFallback = async () => {
      audio.muted = true;
      try {
        await audio.play();
        if (!cancelled) {
          setBgmPlaying(true);
        }
        return true;
      } catch {
        if (!cancelled) {
          setBgmPlaying(false);
        }
        return false;
      }
    };

    const attemptStart = async () => {
      if (userPausedRef.current) {
        return;
      }
      const withSound = await playWithSound();
      if (!withSound) {
        await playMutedFallback();
      }
    };

    attemptStart();

    const retryTimer = window.setInterval(() => {
      if (!audio.paused) {
        window.clearInterval(retryTimer);
        return;
      }
      attemptStart();
    }, 900);
    window.setTimeout(() => window.clearInterval(retryTimer), 12000);

    const onCanPlay = () => {
      if (userPausedRef.current) {
        return;
      }
      if (audio.paused) {
        attemptStart();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible' || userPausedRef.current) {
        return;
      }
      if (audio.paused) {
        attemptStart();
      }
    };

    const unlockOnInteraction = async () => {
      if (userPausedRef.current) {
        return;
      }
      audio.muted = false;
      if (audio.paused) {
        try {
          await audio.play();
          setBgmPlaying(true);
        } catch {}
      }
    };

    audio.addEventListener('canplay', onCanPlay);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pointerdown', unlockOnInteraction);
    window.addEventListener('touchstart', unlockOnInteraction);
    window.addEventListener('keydown', unlockOnInteraction);
    return () => {
      cancelled = true;
      window.clearInterval(retryTimer);
      audio.removeEventListener('canplay', onCanPlay);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pointerdown', unlockOnInteraction);
      window.removeEventListener('touchstart', unlockOnInteraction);
      window.removeEventListener('keydown', unlockOnInteraction);
    };
  }, []);

  const toggleBgm = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audio.paused) {
      userPausedRef.current = false;
      try {
        await audio.play();
        setBgmPlaying(true);
      } catch {
        setBgmPlaying(false);
      }
      return;
    }
    userPausedRef.current = true;
    audio.pause();
    setBgmPlaying(false);
  };

  return (
    <div className="invite-shell">
      <audio
        ref={audioRef}
      src={bgmSrc}
      preload="auto"
      autoPlay
      playsInline
      loop
      onPlay={() => setBgmPlaying(true)}
      onPause={() => setBgmPlaying(false)}
      />
      <IntroOverlay introImages={introImages} />

      <div className="invite-page">
        <HeroSection activeSection={activeSection} revealed={Boolean(revealedSections[0])} sectionMotion={sectionMotion} bgmPlaying={bgmPlaying} toggleBgm={toggleBgm} archImage={archImage} />
        <InvitationSection activeSection={activeSection} revealed={Boolean(revealedSections[1])} sectionMotion={sectionMotion} />
        <CalendarSection activeSection={activeSection} revealed={Boolean(revealedSections[2])} sectionMotion={sectionMotion} weddingDate={weddingDate} countdown={countdown} />
        <LocationSection
          activeSection={activeSection}
          revealed={Boolean(revealedSections[3])}
          sectionMotion={sectionMotion}
          setToastMessage={setToastMessage}
          kakaoAppKey={kakaoAppKey}
        />
        <GallerySection
          activeSection={activeSection}
          sectionMotion={sectionMotion}
          galleryImages={galleryImages}
          galleryPreviewCount={galleryPreviewCount}
        />
        <HeartNoteSection
          activeSection={activeSection}
          revealed={Boolean(revealedSections[5])}
          sectionMotion={sectionMotion}
          transferGroups={transferGroups}
          setToastMessage={setToastMessage}
        />
        <GuestbookSection
          activeSection={activeSection}
          revealed={Boolean(revealedSections[6])}
          sectionMotion={sectionMotion}
          supabase={supabase}
          setToastMessage={setToastMessage}
        />
        <ShareSection activeSection={activeSection} sectionMotion={sectionMotion} kakaoAppKey={kakaoAppKey} setToastMessage={setToastMessage} />
      </div>

      <button
        type="button"
        className={`scroll-top-btn ${showScrollTop ? 'is-visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="맨 위로 이동"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 15l6-6 6 6" />
        </svg>
      </button>

      {toastMessage && <div className="copy-toast">{toastMessage}</div>}
    </div>
  );
}

export default App;
