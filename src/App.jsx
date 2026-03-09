import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import Lightbox from 'yet-another-react-lightbox';
import { ko } from 'date-fns/locale';
import 'react-day-picker/style.css';
import 'yet-another-react-lightbox/styles.css';

const BASE_URL = import.meta.env.BASE_URL;
const introImages = [`${BASE_URL}photos/intro-opt/001.jpg`, `${BASE_URL}photos/intro-opt/003.jpg`];
const archImage = `${BASE_URL}photos/003.jpeg`;
const galleryImages = [
  { thumb: `${BASE_URL}photos/thumbs/001.jpg`, full: `${BASE_URL}photos/001.jpeg` },
  { thumb: `${BASE_URL}photos/thumbs/002.jpg`, full: `${BASE_URL}photos/002.jpeg` },
  { thumb: `${BASE_URL}photos/thumbs/003.jpg`, full: `${BASE_URL}photos/003.jpeg` },
  { thumb: `${BASE_URL}photos/thumbs/004.jpg`, full: `${BASE_URL}photos/004.jpeg` },
  { thumb: `${BASE_URL}photos/thumbs/005.jpg`, full: `${BASE_URL}photos/005.jpeg` },
];
const titleText = 'Our Wedding Day';
const bgmSrc = `${BASE_URL}photos/krasnoshchok-wedding-romantic-love-music-409293.mp3`;
const weddingDate = new Date(2026, 5, 20);
const weddingDateTime = new Date('2026-06-20T11:00:00+09:00');
const venuePosition = { lat: 37.56826, lng: 126.89719 };
const kakaoAppKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
const inviteCanonicalUrl = 'https://moonso-wedding.kro.kr/';
const transferGroups = [
  {
    key: 'groom',
    title: '신랑측에게',
    accounts: [
      { label: '신랑', name: '류무민', bank: '카카오뱅크', number: '3333-29-4997161' },
      { label: '신랑 아버지', name: '류세형', bank: '국민은행', number: '651025-91-112586' },
      { label: '신랑 어머니', name: '이명자', bank: '우리은행', number: '1002-430-424876' },
    ],
  },
  {
    key: 'bride',
    title: '신부측에게',
    accounts: [
      { label: '신부', name: '이소연', bank: '토스뱅크', number: '1000-6214-7063' },
      { label: '신부 아버지', name: '이지홍', bank: '농협은행', number: '351-1234-5678-93' },
      { label: '신부 어머니', name: '심미란', bank: '우리은행', number: '1002-640-220490' },
    ],
  },
];

function getCountdownParts() {
  const now = new Date();
  const diffMs = Math.max(0, weddingDateTime.getTime() - now.getTime());
  const totalSec = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds };
}

const sectionMotion = {
  variants: {
    hidden: { opacity: 0, y: 22 },
    visible: (idx) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.62, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] },
    }),
  },
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.08 },
};

function App() {
  const [introHidden, setIntroHidden] = useState(false);
  const [introAssetsReady, setIntroAssetsReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [countdown, setCountdown] = useState(getCountdownParts);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [mapError, setMapError] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [bgmPlaying, setBgmPlaying] = useState(false);
  const [openTransferMap, setOpenTransferMap] = useState({});
  const audioRef = useRef(null);
  const userPausedRef = useRef(false);
  const kakaoReadyRef = useRef(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

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
    if (introDone || !introAssetsReady) {
      return;
    }

    const hideTimer = setTimeout(() => setIntroHidden(true), 3400);
    const doneTimer = setTimeout(() => {
      setIntroDone(true);
    }, 4200);

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
    const timer = setInterval(() => {
      idx += 1;
      setTypedText(titleText.slice(0, idx));
      if (idx >= titleText.length) {
        clearInterval(timer);
      }
    }, 95);

    return () => clearInterval(timer);
  }, [introHidden, introAssetsReady]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdownParts());
    }, 1000);
    return () => clearInterval(timer);
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
    window.addEventListener('scroll', unlockOnInteraction, { passive: true });
    return () => {
      cancelled = true;
      window.clearInterval(retryTimer);
      audio.removeEventListener('canplay', onCanPlay);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pointerdown', unlockOnInteraction);
      window.removeEventListener('touchstart', unlockOnInteraction);
      window.removeEventListener('keydown', unlockOnInteraction);
      window.removeEventListener('scroll', unlockOnInteraction);
    };
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('.section[data-section-index]'));
    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let best = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        }
        if (best) {
          setActiveSection(Number(best.target.getAttribute('data-section-index')));
        }
      },
      { threshold: [0.08, 0.18, 0.3] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleCopyAddress = async () => {
    const address = '서울 마포구 월드컵로 240 2층 (성산동 서울월드컵경기장 서측)';
    try {
      await navigator.clipboard.writeText(address);
      setToastMessage('주소가 복사되었습니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
    } catch {
      setToastMessage('');
    }
  };

  const getInviteShareUrl = () => {
    if (typeof window === 'undefined') {
      return inviteCanonicalUrl;
    }
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return inviteCanonicalUrl;
    }
    return window.location.href;
  };

  const handleCopyAccount = async (accountNo) => {
    if (!accountNo) {
      return;
    }
    const normalized = accountNo.replace(/-/g, '');
    try {
      await navigator.clipboard.writeText(normalized);
      setToastMessage('계좌번호가 복사되었습니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
    } catch {
      setToastMessage('');
    }
  };

  const handleCopyInviteLink = async () => {
    const url = getInviteShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setToastMessage('청첩장 주소가 복사되었습니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
    } catch {
      setToastMessage('');
    }
  };

  const handleShareInvite = async () => {
    const shareUrl = getInviteShareUrl();
    try {
      await ensureKakaoReady();
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: '류무민 ♥ 이소연 결혼식에 초대합니다',
          description: '2026년 6월 20일 토요일 오전 11시, 월드컵컨벤션 2F 임페리얼볼룸',
          imageUrl: `${inviteCanonicalUrl}photos/003.jpeg`,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '청첩장 보기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    } catch {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setToastMessage('카카오 공유 오류로 청첩장 주소를 복사했습니다.');
        window.setTimeout(() => setToastMessage(''), 1800);
      } catch {
        setToastMessage('카카오톡 공유를 불러오지 못했습니다.');
        window.setTimeout(() => setToastMessage(''), 1800);
      }
    }
  };

  const ensureKakaoReady = async () => {
    if (!kakaoAppKey) {
      throw new Error('Missing kakao app key');
    }
    if (window.Kakao?.isInitialized?.()) {
      kakaoReadyRef.current = true;
      return;
    }

    const existing = document.getElementById('kakao-share-sdk');
    if (!existing) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = 'kakao-share-sdk';
        script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    } else if (!window.Kakao) {
      await new Promise((resolve, reject) => {
        const onLoad = () => {
          existing.removeEventListener('load', onLoad);
          existing.removeEventListener('error', onError);
          resolve();
        };
        const onError = () => {
          existing.removeEventListener('load', onLoad);
          existing.removeEventListener('error', onError);
          reject(new Error('Kakao SDK load failed'));
        };
        existing.addEventListener('load', onLoad);
        existing.addEventListener('error', onError);
      });
    }

    if (!window.Kakao) {
      throw new Error('Kakao SDK unavailable');
    }
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoAppKey);
    }
    kakaoReadyRef.current = true;
  };

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

  useEffect(() => {
    const mapContainer = document.getElementById('kakao-map');
    if (!kakaoAppKey || !mapContainer) {
      return;
    }

    let cancelled = false;

    const drawMap = () => {
      if (cancelled || !window.kakao?.maps || !mapContainer) {
        return;
      }
      const center = new window.kakao.maps.LatLng(venuePosition.lat, venuePosition.lng);
      const map = new window.kakao.maps.Map(mapContainer, { center, level: 3 });
      new window.kakao.maps.Marker({ position: center, map });
      setMapError(false);
    };

    if (window.kakao?.maps) {
      window.kakao.maps.load(drawMap);
      return;
    }

    const existingScript = document.getElementById('kakao-map-sdk');
    const handleLoad = () => {
      if (!cancelled && window.kakao?.maps) {
        window.kakao.maps.load(drawMap);
      }
    };
    const handleError = () => {
      if (!cancelled) {
        setMapError(true);
      }
    };

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad);
      existingScript.addEventListener('error', handleError);
    } else {
      const script = document.createElement('script');
      script.id = 'kakao-map-sdk';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoAppKey}&autoload=false`;
      script.async = true;
      script.addEventListener('load', handleLoad);
      script.addEventListener('error', handleError);
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      const script = document.getElementById('kakao-map-sdk');
      if (script) {
        script.removeEventListener('load', handleLoad);
        script.removeEventListener('error', handleError);
      }
    };
  }, [kakaoAppKey]);

  useEffect(() => {
    if (!kakaoAppKey || kakaoReadyRef.current) {
      return;
    }
    ensureKakaoReady().catch(() => {});
  }, [kakaoAppKey]);

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
      {!introDone && introAssetsReady && (
        <div className={`intro-overlay ${introHidden ? 'is-hidden' : ''}`} aria-hidden={introHidden}>
          <div className="intro-frame">
            <img className="intro-image intro-image-1" src={introImages[0]} alt="" />
            <img className="intro-image intro-image-2" src={introImages[1]} alt="" />
          </div>
          <div className="intro-copy">
            <p>류무민 &#9829; 이소연</p>
            <h2 className="typewriter">
              {typedText}
              <span className={`cursor ${introHidden ? 'hidden' : ''}`}>|</span>
            </h2>
            <p>2026.06.20 SAT AM 11:00</p>
          </div>
        </div>
      )}

      <div className="invite-page">
        <motion.header
          className={`hero section ${activeSection === 0 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="0"
          custom={0}
          {...sectionMotion}
        >
          <button
            type="button"
            className={`bgm-toggle ${bgmPlaying ? 'is-playing' : ''}`}
            onClick={toggleBgm}
            aria-label={bgmPlaying ? '배경음악 정지' : '배경음악 재생'}
          >
            {bgmPlaying ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle className="eq-dot" cx="5.5" cy="17.5" r="1.4" />
                <rect className="eq-bar eq-bar-1" x="8.5" y="10" width="2.4" height="8" rx="1.1" />
                <rect className="eq-bar eq-bar-2" x="12.5" y="8.8" width="2.4" height="9.2" rx="1.1" />
                <rect className="eq-bar eq-bar-3" x="16.5" y="12" width="2.4" height="6" rx="1.1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path className="play-triangle" d="M9 7.2v9.6c0 .6.64.97 1.14.65l7.26-4.8a.78.78 0 0 0 0-1.3l-7.26-4.8A.77.77 0 0 0 9 7.2Z" />
              </svg>
            )}
          </button>
          <div className="hero-arch">
            <img className="hero-image" src={archImage} alt="신랑 신부 메인 사진" />
            <div className="hero-arch-title">
              <span>Our</span>
              <span>Wedding Day</span>
            </div>
            <div className="hero-arch-bottom">
              <div className="hero-arch-sub hero-arch-names">류무민 &#9829; 이소연</div>
              <div className="hero-arch-sub hero-arch-date">2026.06.20 SAT AM 11:00</div>
            </div>
          </div>
        </motion.header>

        <motion.section
          className={`section message ${activeSection === 1 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="1"
          custom={1}
          {...sectionMotion}
        >
          <p className="map-eyebrow">Invitation</p>
          <h2>초대합니다</h2>
          <p className="message-poem">
            <span className="accent-initial">무</span>르익은 사랑 속에서
            <br />
            <span className="accent-initial">민</span>들레 홀씨처럼 인연으로 만난 두 사람
            <br />
            <span className="accent-initial">소</span>중한 마음이 하나 되어
            <br />
            <span className="accent-initial">연</span>인에서 부부로, 평생을 함께 걸어가려 합니다.
            <br />
            귀한 걸음으로 이 자리를 빛내 주신다면
            <br />
            더 없는 기쁨으로 오래도록 간직하겠습니다.
          </p>
          <div className="people">
            <div className="message-emblem" aria-hidden="true">
              <svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" fill="none">
                <path
                  d="M 230 300 C 150 300, 150 200, 200 200 C 230 200, 250 250, 400 350 C 550 250, 570 200, 600 200 C 650 200, 650 300, 570 300 M 400 350 C 350 250, 280 150, 400 100 C 520 150, 450 250, 400 350"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 230 300 C 200 300, 180 330, 200 350 C 220 370, 250 350, 240 330 M 570 300 C 600 300, 620 330, 600 350 C 580 370, 550 350, 560 330"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="rows">
              <div className="row family-row">
                <div className="family-head">
                  <span className="role">신랑</span>
                </div>
                <p className="family-line">류세형 · 이명자의 장남</p>
                <div className="name-contact">
                  <strong>류무민</strong>
                  <a className="phone-icon-link" href="tel:01080201271" aria-label="신랑에게 전화하기">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.65 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.22a2 2 0 0 1 2.11-.45c.84.31 1.72.53 2.62.65A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="row family-row">
                <div className="family-head">
                  <span className="role">신부</span>
                </div>
                <p className="family-line">이지홍 · 심미란의 장녀</p>
                <div className="name-contact">
                  <strong>이소연</strong>
                  <a className="phone-icon-link" href="tel:01021704869" aria-label="신부에게 전화하기">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.65 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.22a2 2 0 0 1 2.11-.45c.84.31 1.72.53 2.62.65A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className={`section calendar ${activeSection === 2 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="2"
          custom={2}
          {...sectionMotion}
        >
          <p className="map-eyebrow">Wedding Day</p>
          <h2>2026. 06. 20. 토요일 오전 11시</h2>
          <div className="calendar-wrap">
            <DayPicker
              mode="single"
              month={new Date(2026, 5)}
              selected={weddingDate}
              defaultMonth={new Date(2026, 5)}
              disableNavigation
              hideNavigation
              required
              onSelect={() => {}}
              disabled={(date) =>
                date.getFullYear() !== 2026 || date.getMonth() !== 5 || date.getDate() !== 20
              }
              showOutsideDays={false}
              locale={ko}
              formatters={{
                formatCaption: (month) => `${month.getMonth() + 1}월`,
              }}
              className="wedding-calendar"
              modifiersClassNames={{
                selected: 'wedding-day-selected',
                today: 'wedding-day-today',
              }}
            />
          </div>
          <div className="calendar-caption">
            <div className="count-grid">
              <div className="count-item">
                <span>DAYS</span>
                <strong>{countdown.days}</strong>
              </div>
              <div className="count-item">
                <span>HOUR</span>
                <strong>{countdown.hours}</strong>
              </div>
              <div className="count-item">
                <span>MIN</span>
                <strong>{countdown.minutes}</strong>
              </div>
              <div className="count-item">
                <span>SEC</span>
                <strong>{countdown.seconds}</strong>
              </div>
            </div>
            <p className="count-copy">
              류무민 <span>&#9829;</span> 이소연의 결혼식이 <strong>{countdown.days + 1}일</strong> 남았습니다.
            </p>
          </div>
        </motion.section>

        <motion.section
          className={`section map ${activeSection === 3 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="3"
          custom={3}
          {...sectionMotion}
        >
          <p className="map-eyebrow">Location</p>
          <h2>오시는 길</h2>
          <p className="map-venue">월드컵컨벤션 2F 임페리얼볼룸</p>
          <div className="map-address-row">
            <button type="button" className="copy-address-btn" onClick={handleCopyAddress} aria-label="주소 복사">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="copy-icon"
                aria-hidden="true"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            <p className="map-address">서울 마포구 월드컵로 240 2층</p>
          </div>
          <div className="map-frame">
            {!kakaoAppKey ? (
              <div className="map-placeholder">카카오 지도 앱키(`VITE_KAKAO_MAP_APP_KEY`)를 설정해 주세요.</div>
            ) : mapError ? (
              <div className="map-placeholder map-error">
                <p>카카오 지도를 불러오지 못했습니다.</p>
                <p>JavaScript 키 / Web 플랫폼 도메인을 확인해 주세요.</p>
                <p className="map-origin">현재 도메인: {window.location.origin}</p>
              </div>
            ) : (
              <div id="kakao-map" className="kakao-map" />
            )}
          </div>
          <div className="actions">
            <a
              href="https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%20%EB%A7%88%ED%8F%AC%EA%B5%AC%20%EC%9B%94%EB%93%9C%EC%BB%B5%EB%A1%9C%20240"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="action-icon"
                aria-hidden="true"
              >
                <rect width="24" height="24" rx="6" fill="#FFFFFF" />
                <path d="M7 17H17C18.1 17 19 16.1 19 15V15H5V15C5 16.1 5.9 17 7 17Z" fill="#4285F4" />
                <path d="M12 4C10.3 4 9 5.3 9 7C9 9.3 12 13 12 13C12 13 15 9.3 15 7C15 5.3 13.7 4 12 4Z" fill="#03C75A" />
                <path d="M11 6V8L13 6V8" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              네이버지도
            </a>
            <a
              href="https://www.tmap.co.kr/tmap2/mobile/route.jsp?name=%EC%9B%94%EB%93%9C%EC%BB%B5%EC%BB%A8%EB%B2%A4%EC%85%98&lon=126.89719&lat=37.56826"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="action-icon"
                aria-hidden="true"
              >
                <rect width="24" height="24" rx="6" fill="url(#tmap_gradient)" />
                <path d="M12 7.5V17M12 7.5H8.5M12 7.5H15.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <defs>
                  <linearGradient id="tmap_gradient" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#FC41BE" />
                    <stop offset="0.5" stopColor="#7B5BFA" />
                    <stop offset="1" stopColor="#0F9EFF" />
                  </linearGradient>
                </defs>
              </svg>
              티맵
            </a>
            <a
              href="https://map.kakao.com/link/search/%EC%84%9C%EC%9A%B8%20%EB%A7%88%ED%8F%AC%EA%B5%AC%20%EC%9B%94%EB%93%9C%EC%BB%B5%EB%A1%9C%20240"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="action-icon"
                aria-hidden="true"
              >
                <rect width="24" height="24" rx="6" fill="#FEE500" />
                <path
                  d="M12 18C12 18 17 13.5 17 9.5C17 6.7 14.8 4.5 12 4.5C9.2 4.5 7 6.7 7 9.5C7 13.5 12 18 12 18Z"
                  fill="#1E69FE"
                />
                <circle cx="12" cy="9.5" r="1.5" fill="#FEE500" />
              </svg>
              카카오맵
            </a>
          </div>
          <div className="transport-guide">
            <div className="transport-item">
              <h3 className="transport-head">
                <svg
                  className="transport-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="4" y="3" width="16" height="16" rx="2" ry="2" />
                  <path d="M4 11h16" />
                  <path d="M8 15h.01" />
                  <path d="M16 15h.01" />
                  <path d="M6 19v2" />
                  <path d="M18 19v2" />
                </svg>
                <span>버스</span>
              </h3>
              <p className="point">월드컵경기장 서측 문화비축기지 정류장 하차 도보 3분</p>
              <p>간선: 571, 710, 760</p>
              <p>지선: 7019, 7715, 8777</p>
              <p>광역: 9711</p>
            </div>

            <div className="transport-item">
              <h3 className="transport-head">
                <svg
                  className="transport-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="4" y="3" width="16" height="16" rx="2" ry="2" />
                  <path d="M4 11h16" />
                  <path d="M12 3v8" />
                  <path d="M8 16h.01" />
                  <path d="M16 16h.01" />
                  <path d="M2 21h20" />
                </svg>
                <span>지하철</span>
              </h3>
              <p className="point">6호선 월드컵경기장역 2번 출구 도보 3분 (200m)</p>
              <p>월드컵경기장역 2번 출구에서 경기장 서측(W) 방향</p>
              <p>환승: 2호선 합정, 3호선 불광·약수, 4호선 삼각지, 5호선 공덕</p>
            </div>

            <div className="transport-item">
              <h3 className="transport-head">
                <svg
                  className="transport-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
                <span>자동차</span>
              </h3>
              <p className="point">월드컵경기장 서문 진입 후 서측 1,2 주차장 이용</p>
              <p>주차 접수대 등록 후 출차 (90분 무료)</p>
              <p>외부 주차 2시간 30분 무료 · 발렛파킹 무료</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className={`section gallery ${activeSection === 4 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="4"
          custom={5}
          {...sectionMotion}
        >
          <p className="map-eyebrow">Gallery</p>
          <h2>갤러리</h2>
          <div className="grid">
            {galleryImages.map((image, idx) => (
              <button
                key={image.full}
                type="button"
                className="gallery-item"
                onClick={() => {
                  setLightboxIndex(idx);
                  setLightboxOpen(true);
                }}
              >
                <img src={image.thumb} alt={`웨딩 사진 ${idx + 1}`} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </motion.section>

        <motion.section
          className={`section heart-note ${activeSection === 5 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="5"
          custom={6}
          {...sectionMotion}
        >
          <p className="map-eyebrow">With Heart</p>
          <h2>마음 전하실 곳</h2>
          <p>
            참석이 어려우신 분들을 위해 기재했습니다.
            <br />
            너그러운 마음으로 양해 부탁드립니다.
          </p>
          <div className="transfer-wrap">
            {transferGroups.map((group) => {
              const isOpen = Boolean(openTransferMap[group.key]);
              return (
                <div key={group.key} className={`transfer-group ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="transfer-trigger"
                    onClick={() =>
                      setOpenTransferMap((prev) => ({
                        ...prev,
                        [group.key]: !prev[group.key],
                      }))
                    }
                    aria-expanded={isOpen}
                  >
                    <span>{group.title}</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d={isOpen ? 'M6 14l6-6 6 6' : 'M6 10l6 6 6-6'} />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="transfer-content">
                      {group.accounts.map((account) => (
                        <div key={`${group.key}-${account.label}`} className="transfer-card">
                          <div className="transfer-head">
                            <span>{account.label}</span>
                            <strong>{account.name}</strong>
                          </div>
                          <div className="transfer-account">
                            <div className="transfer-account-text">
                              <span>{account.bank}</span>
                              <strong>{account.number}</strong>
                            </div>
                            <button
                              type="button"
                              className="transfer-copy-btn"
                              onClick={() => handleCopyAccount(account.number)}
                              aria-label={`${account.name} 계좌번호 복사`}
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.section>

        <motion.footer
          className={`section footer ${activeSection === 6 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="6"
          custom={7}
          {...sectionMotion}
        >
          <div className="share-actions">
            <button type="button" className="share-btn share-kakao" onClick={handleShareInvite}>
              <span>카카오톡으로 청첩장 전하기</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 18 18 6" />
                <path d="M9 6h9v9" />
              </svg>
            </button>
            <button type="button" className="share-btn share-copy" onClick={handleCopyInviteLink}>
              <span>청첩장 주소 복사하기</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </motion.footer>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={galleryImages.map((image) => ({ src: image.full }))}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
        carousel={{ padding: 0, imageFit: 'contain' }}
      />

      {lightboxOpen && (
        <div className="lightbox-footer-dots-overlay" aria-label={`현재 ${lightboxIndex + 1}번째 사진`}>
          {galleryImages.map((_, idx) => (
            <span key={`dot-${idx}`} className={`lightbox-dot ${idx === lightboxIndex ? 'is-active' : ''}`} />
          ))}
        </div>
      )}

      {toastMessage && <div className="copy-toast">{toastMessage}</div>}
    </div>
  );
}

export default App;
