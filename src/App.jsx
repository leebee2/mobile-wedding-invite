import { useEffect, useState } from 'react';
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
  `${BASE_URL}photos/001.jpeg`,
  `${BASE_URL}photos/002.jpeg`,
  `${BASE_URL}photos/003.jpeg`,
  `${BASE_URL}photos/004.jpeg`,
  `${BASE_URL}photos/005.jpeg`,
];
const titleText = 'Our Wedding Day';
const weddingDate = new Date(2026, 5, 20);
const weddingDateTime = new Date('2026-06-20T11:00:00+09:00');
const venuePosition = { lat: 37.56826, lng: 126.89719 };
const kakaoAppKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;

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
  const [addressCopied, setAddressCopied] = useState(false);

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
      setAddressCopied(true);
      window.setTimeout(() => setAddressCopied(false), 1800);
    } catch {
      setAddressCopied(false);
    }
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

  return (
    <div className="invite-shell">
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
          <p>
            소중한 분들을 초대합니다
            <br />
            <br />
            저희 두 사람의 작은 만남이
            <br />
            진실한 사랑으로 꽃피어
            <br />
            오늘 이 자리를 빛내는 결혼식으로 이어졌습니다.
            <br />
            <br />
            평생 서로를 귀히 여기며
            <br />
            처음의 설렘과 순수함을 잃지 않고
            <br />
            존중하고 아껴 나가겠습니다.
            <br />
            <br />
            믿음과 사랑을 기초로 한 이 날에
            <br />
            여러분의 따뜻한 축복이 함께 한다면
            <br />
            더할 나위 없는 기쁨으로 간직하겠습니다.
          </p>
        </motion.section>

        <motion.section
          className={`section people ${activeSection === 2 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="2"
          custom={2}
          {...sectionMotion}
        >
          <h2>신랑 · 신부</h2>
          <div className="rows">
            <div className="row family-row">
              <div className="family-head">
                <span className="role">신랑</span>
                <a href="tel:01080201271">신랑 연락하기</a>
              </div>
              <p className="family-line">류세형 · 이명자의 장남</p>
              <strong>류무민</strong>
            </div>
            <div className="row family-row">
              <div className="family-head">
                <span className="role">신부</span>
                <a href="tel:01021704869">신부 연락하기</a>
              </div>
              <p className="family-line">이지홍 · 심미란의 장녀</p>
              <strong>이소연</strong>
            </div>
          </div>
        </motion.section>

        <motion.section
          className={`section calendar ${activeSection === 3 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="3"
          custom={3}
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
          className={`section map ${activeSection === 4 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="4"
          custom={4}
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
          className={`section gallery ${activeSection === 5 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="5"
          custom={6}
          {...sectionMotion}
        >
          <p className="map-eyebrow">Gallery</p>
          <h2>갤러리</h2>
          <div className="grid">
            {galleryImages.map((src, idx) => (
              <button
                key={src}
                type="button"
                className="gallery-item"
                onClick={() => {
                  setLightboxIndex(idx);
                  setLightboxOpen(true);
                }}
              >
                <img src={src} alt={`웨딩 사진 ${idx + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        </motion.section>

        <motion.footer
          className={`section footer ${activeSection === 6 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="6"
          custom={7}
          {...sectionMotion}
        >
          <p>함께해 주셔서 감사합니다.</p>
        </motion.footer>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={galleryImages.map((src) => ({ src }))}
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

      {addressCopied && <div className="copy-toast">주소가 복사되었습니다.</div>}
    </div>
  );
}

export default App;
