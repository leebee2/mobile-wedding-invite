import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { RevealText } from '../shared/ui';

export default function LocationSection({
  activeSection,
  revealed,
  sectionMotion,
  setToastMessage,
  kakaoAppKey,
  mapError,
}) {
  const [transportGuideVisible, setTransportGuideVisible] = useState(false);
  const transportGuideRef = useRef(null);

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

  useEffect(() => {
    if (!transportGuideRef.current || transportGuideVisible) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setTransportGuideVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(transportGuideRef.current);
    return () => observer.disconnect();
  }, [transportGuideVisible]);

  return (
    <motion.section
      className={`section map ${activeSection === 3 ? 'is-current' : 'is-dimmed'}`}
      data-section-index="3"
      custom={3}
      {...sectionMotion}
    >
      <RevealText as="p" className="map-eyebrow" lines={['Location']} active={revealed} />
      <RevealText as="h2" className="section-title" lines={['오시는 길']} active={revealed} />
      <RevealText as="p" className="map-venue" lines={['월드컵컨벤션 2F 임페리얼볼룸']} active={revealed} />
      <div className="map-address-row">
        <button type="button" className="copy-address-btn" onClick={handleCopyAddress} aria-label="주소 복사">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="copy-icon" aria-hidden="true">
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
        <a href="https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%20%EB%A7%88%ED%8F%AC%EA%B5%AC%20%EC%9B%94%EB%93%9C%EC%BB%B5%EB%A1%9C%20240" target="_blank" rel="noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="action-icon" aria-hidden="true">
            <rect width="24" height="24" rx="6" fill="#FFFFFF" />
            <path d="M7 17H17C18.1 17 19 16.1 19 15V15H5V15C5 16.1 5.9 17 7 17Z" fill="#4285F4" />
            <path d="M12 4C10.3 4 9 5.3 9 7C9 9.3 12 13 12 13C12 13 15 9.3 15 7C15 5.3 13.7 4 12 4Z" fill="#03C75A" />
            <path d="M11 6V8L13 6V8" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          네이버지도
        </a>
        <a href="https://www.tmap.co.kr/tmap2/mobile/route.jsp?name=%EC%9B%94%EB%93%9C%EC%BB%B5%EC%BB%A8%EB%B2%A4%EC%85%98&lon=126.89719&lat=37.56826" target="_blank" rel="noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="action-icon" aria-hidden="true">
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
        <a href="https://map.kakao.com/link/search/%EC%84%9C%EC%9A%B8%20%EB%A7%88%ED%8F%AC%EA%B5%AC%20%EC%9B%94%EB%93%9C%EC%BB%B5%EB%A1%9C%20240" target="_blank" rel="noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="action-icon" aria-hidden="true">
            <rect width="24" height="24" rx="6" fill="#FEE500" />
            <path d="M12 18C12 18 17 13.5 17 9.5C17 6.7 14.8 4.5 12 4.5C9.2 4.5 7 6.7 7 9.5C7 13.5 12 18 12 18Z" fill="#1E69FE" />
            <circle cx="12" cy="9.5" r="1.5" fill="#FEE500" />
          </svg>
          카카오맵
        </a>
      </div>
      <div ref={transportGuideRef} className="transport-guide">
        <div className="transport-item">
          <h3 className="transport-head">
            <svg className="transport-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="3" width="16" height="16" rx="2" ry="2" />
              <path d="M4 11h16" />
              <path d="M8 15h.01" />
              <path d="M16 15h.01" />
              <path d="M6 19v2" />
              <path d="M18 19v2" />
            </svg>
            <span>버스</span>
          </h3>
          <RevealText as="p" className="point" lines={['월드컵경기장 서측 문화비축기지 정류장 하차 도보 3분']} baseDelay={0.05} active={transportGuideVisible} />
          <RevealText as="p" lines={['간선: 571, 710, 760']} baseDelay={0.1} active={transportGuideVisible} />
          <RevealText as="p" lines={['지선: 7019, 7715, 8777']} baseDelay={0.15} active={transportGuideVisible} />
          <RevealText as="p" lines={['광역: 9711']} baseDelay={0.2} active={transportGuideVisible} />
        </div>
        <div className="transport-item">
          <h3 className="transport-head">
            <svg className="transport-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="3" width="16" height="16" rx="2" ry="2" />
              <path d="M4 11h16" />
              <path d="M12 3v8" />
              <path d="M8 16h.01" />
              <path d="M16 16h.01" />
              <path d="M2 21h20" />
            </svg>
            <span>지하철</span>
          </h3>
          <RevealText as="p" className="point" lines={['6호선 월드컵경기장역 2번 출구 도보 3분 (200m)']} baseDelay={0.24} active={transportGuideVisible} />
          <RevealText as="p" lines={['월드컵경기장역 2번 출구에서 경기장 서측(W) 방향']} baseDelay={0.29} active={transportGuideVisible} />
          <RevealText as="p" lines={['환승: 2호선 합정, 3호선 불광·약수, 4호선 삼각지, 5호선 공덕']} baseDelay={0.34} active={transportGuideVisible} />
        </div>
        <div className="transport-item">
          <h3 className="transport-head">
            <svg className="transport-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            <span>자동차</span>
          </h3>
          <RevealText as="p" className="point" lines={['월드컵경기장 서문 진입 후 서측 1,2 주차장 이용']} baseDelay={0.38} active={transportGuideVisible} />
          <RevealText as="p" lines={['주차 접수대 등록 후 출차 (90분 무료)']} baseDelay={0.43} active={transportGuideVisible} />
          <RevealText as="p" lines={['외부 주차 2시간 30분 무료 · 발렛파킹 무료']} baseDelay={0.48} active={transportGuideVisible} />
        </div>
      </div>
    </motion.section>
  );
}
