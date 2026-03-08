import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import { CircleMarker, MapContainer, TileLayer } from 'react-leaflet';
import Lightbox from 'yet-another-react-lightbox';
import { ko } from 'date-fns/locale';
import 'react-day-picker/style.css';
import 'leaflet/dist/leaflet.css';
import 'yet-another-react-lightbox/styles.css';

const BASE_URL = import.meta.env.BASE_URL;
const introImages = [`${BASE_URL}photos/001.jpeg`, `${BASE_URL}photos/003.jpeg`];
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
  viewport: { once: true, amount: 0.2 },
};

function App() {
  const [introHidden, setIntroHidden] = useState(false);
  const [introDone, setIntroDone] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    const navEntry = window.performance?.getEntriesByType?.('navigation')?.[0];
    const isReloadByEntry = navEntry?.type === 'reload';
    const isReloadByLegacy = window.performance?.navigation?.type === 1;

    if (isReloadByEntry || isReloadByLegacy) {
      window.localStorage.setItem('invite_intro_seen', 'false');
      return false;
    }

    return window.localStorage.getItem('invite_intro_seen') === 'true';
  });
  const [typedText, setTypedText] = useState('');
  const [countdown, setCountdown] = useState(getCountdownParts);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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
    if (introDone) {
      return;
    }

    const hideTimer = setTimeout(() => setIntroHidden(true), 3400);
    const doneTimer = setTimeout(() => {
      setIntroDone(true);
      window.localStorage.setItem('invite_intro_seen', 'true');
    }, 4200);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(doneTimer);
    };
  }, [introDone]);

  useEffect(() => {
    if (introHidden) {
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
  }, [introHidden]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdownParts());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="invite-shell">
      {!introDone && (
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
        <motion.header className="hero section" custom={0} {...sectionMotion}>
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

        <motion.section className="section message" custom={1} {...sectionMotion}>
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

        <motion.section className="section people" custom={2} {...sectionMotion}>
          <h2>신랑 · 신부</h2>
          <div className="rows">
            <div className="row family-row">
              <div className="family-head">
                <span className="role">신랑</span>
                <a href="tel:01012345678">신랑 연락하기</a>
              </div>
              <p className="family-line">류세형 · 이명자의 아들</p>
              <strong>류무민</strong>
            </div>
            <div className="row family-row">
              <div className="family-head">
                <span className="role">신부</span>
                <a href="tel:01087654321">신부 연락하기</a>
              </div>
              <p className="family-line">이지홍 · 심미란의 딸</p>
              <strong>이소연</strong>
            </div>
          </div>
        </motion.section>

        <motion.section className="section calendar" custom={3} {...sectionMotion}>
          <h2>Wedding Day</h2>
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

        <motion.section className="section map" custom={4} {...sectionMotion}>
          <p className="map-eyebrow">Location</p>
          <h2>오시는 길</h2>
          <p className="map-venue">월드컵컨벤션</p>
          <p className="map-address">서울 마포구 월드컵로 240 2층</p>
          <p className="map-address-sub">(성산동 서울월드컵경기장 서측)</p>
          <div className="map-frame">
            <MapContainer
              center={[venuePosition.lat, venuePosition.lng]}
              zoom={17}
              scrollWheelZoom={false}
              className="leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <CircleMarker center={[venuePosition.lat, venuePosition.lng]} radius={8} pathOptions={{ color: '#8a5f47' }} />
            </MapContainer>
          </div>
          <div className="actions">
            <a
              href="https://map.naver.com/p/search/%EC%9B%94%EB%93%9C%EC%BB%B5%EC%BB%A8%EB%B2%A4%EC%85%98"
              target="_blank"
              rel="noreferrer"
            >
              네이버지도
            </a>
            <a
              href="https://www.tmap.co.kr/tmap2/search.jsp?keywords=%EC%9B%94%EB%93%9C%EC%BB%B5%EC%BB%A8%EB%B2%A4%EC%85%98"
              target="_blank"
              rel="noreferrer"
            >
              티맵
            </a>
            <a
              href="https://map.kakao.com/link/search/%EC%9B%94%EB%93%9C%EC%BB%B5%EC%BB%A8%EB%B2%A4%EC%85%98"
              target="_blank"
              rel="noreferrer"
            >
              카카오맵
            </a>
          </div>
          <div className="transport-guide">
            <div className="transport-item">
              <h3>버스</h3>
              <p className="point">월드컵경기장 서측 문화비축기지 정류장 하차 도보 3분</p>
              <p>간선: 571, 710, 760</p>
              <p>지선: 7019, 7715, 8777</p>
              <p>광역: 9711</p>
            </div>

            <div className="transport-item">
              <h3>지하철</h3>
              <p className="point">6호선 월드컵경기장역 2번 출구 도보 3분 (200m)</p>
              <p>월드컵경기장역 2번 출구에서 경기장 서측(W) 방향</p>
              <p>환승: 2호선 합정, 3호선 불광·약수, 4호선 삼각지, 5호선 공덕</p>
            </div>

            <div className="transport-item">
              <h3>자동차</h3>
              <p className="point">월드컵경기장 서문 진입 후 서측 1,2 주차장 이용</p>
              <p>주차 접수대 등록 후 출차 (90분 무료)</p>
              <p>외부 주차 2시간 30분 무료 · 발렛파킹 무료</p>
            </div>
          </div>
        </motion.section>

        <motion.section className="section gallery" custom={6} {...sectionMotion}>
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

        <motion.footer className="section footer" custom={7} {...sectionMotion}>
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
    </div>
  );
}

export default App;
