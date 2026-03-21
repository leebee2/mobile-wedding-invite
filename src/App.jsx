import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import Lightbox from 'yet-another-react-lightbox';
import { createClient } from '@supabase/supabase-js';
import { ko } from 'date-fns/locale';
import 'react-day-picker/style.css';
import 'yet-another-react-lightbox/styles.css';

const BASE_URL = import.meta.env.BASE_URL;
const introImages = [`${BASE_URL}photos/intro-opt/001.jpg`, `${BASE_URL}photos/intro-opt/003.jpg`];
const archImage = `${BASE_URL}photos/main.jpeg`;
const galleryFiles = [
  { full: 'YG_00081.jpg', thumb: 'YG_00081.jpg' },
  { full: 'YG_00277.jpg', thumb: 'YG_00277.jpg' },
  { full: '002.jpeg', thumb: '002.jpg' },
  { full: 'YG_00337.jpg', thumb: 'YG_00337.jpg' },
  { full: 'YG_00566.jpg', thumb: 'YG_00566.jpg' },
  { full: 'YG_00671.jpg', thumb: 'YG_00671.jpg' },
  { full: 'YG_00849.jpg', thumb: 'YG_00849.jpg' },
  { full: 'YG_00907.jpg', thumb: 'YG_00907.jpg' },
  { full: 'YG_00970.jpg', thumb: 'YG_00970.jpg' },
  { full: 'YG_01006.jpg', thumb: 'YG_01006.jpg' },
  { full: 'YG_01176.jpg', thumb: 'YG_01176.jpg' },
  { full: '004.jpeg', thumb: '004.jpg' },
  { full: 'YG_01812.jpg', thumb: 'YG_01812.jpg' },
  { full: '003.jpeg', thumb: '003.jpg' },
  { full: 'YG_02075.jpg', thumb: 'YG_02075.jpg' },
  { full: 'YG_02348.jpg', thumb: 'YG_02348.jpg' },
  { full: 'YG_02359.jpg', thumb: 'YG_02359.jpg' },
  { full: 'YG_02490.jpg', thumb: 'YG_02490.jpg' },
  { full: 'YG_02690.jpg', thumb: 'YG_02690.jpg' },
  { full: 'YG_02792.jpg', thumb: 'YG_02792.jpg' },
  { full: 'YG_02944.jpg', thumb: 'YG_02944.jpg' },
  { full: 'YG_02976.jpg', thumb: 'YG_02976.jpg' },
];
const galleryImages = galleryFiles.map((file) => ({
  thumb: `${BASE_URL}photos/thumbs/${file.thumb}`,
  full: `${BASE_URL}photos/${file.full}`,
}));
const galleryPreviewCount = 6;
const introTitleLines = ["We're", 'getting', 'married'];
const titleText = introTitleLines.join(' ');
const bgmSrc = `${BASE_URL}photos/krasnoshchok-wedding-romantic-love-music-409293.mp3`;
const weddingDate = new Date(2026, 5, 20);
const weddingDateTime = new Date('2026-06-20T11:00:00+09:00');
const venuePosition = { lat: 37.56826, lng: 126.89719 };
const kakaoAppKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
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
      { label: '신부 아버지', name: '이지홍', bank: '농협', number: '356-1603-9701-83' },
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

function formatGuestbookDate(value) {
  const date = new Date(value);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
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

function RevealText({ as: Tag = 'p', className = '', lines = [], baseDelay = 0, lineClassName = '', active = true }) {
  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        <span key={`${className}-${index}`} className={`reveal-line ${lineClassName}`.trim()}>
          <motion.span
            className="reveal-line-inner"
            initial={{ opacity: 0, y: '115%' }}
            animate={active ? { opacity: 1, y: '0%' } : { opacity: 0, y: '115%' }}
            transition={{ duration: 0.68, delay: baseDelay + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

function App() {
  const [introHidden, setIntroHidden] = useState(false);
  const [introAssetsReady, setIntroAssetsReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [countdown, setCountdown] = useState(getCountdownParts);
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [revealedSections, setRevealedSections] = useState({ 0: true });
  const [mapError, setMapError] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [bgmPlaying, setBgmPlaying] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [transportGuideVisible, setTransportGuideVisible] = useState(false);
  const [openTransferMap, setOpenTransferMap] = useState({});
  const [guestbookName, setGuestbookName] = useState('');
  const [guestbookPassword, setGuestbookPassword] = useState('');
  const [guestbookMessage, setGuestbookMessage] = useState('');
  const [guestbookItems, setGuestbookItems] = useState([]);
  const [guestbookLoading, setGuestbookLoading] = useState(true);
  const [guestbookSubmitting, setGuestbookSubmitting] = useState(false);
  const [guestbookModalOpen, setGuestbookModalOpen] = useState(false);
  const [guestbookViewerOpen, setGuestbookViewerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const audioRef = useRef(null);
  const transportGuideRef = useRef(null);
  const userPausedRef = useRef(false);
  const kakaoReadyRef = useRef(false);
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

    const hideTimer = setTimeout(() => setIntroHidden(true), 5200);
    const doneTimer = setTimeout(() => {
      setIntroDone(true);
    }, 6500);

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
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 520);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    setRevealedSections((prev) => (prev[activeSection] ? prev : { ...prev, [activeSection]: true }));
  }, [activeSection]);

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
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setToastMessage('청첩장 주소가 복사되었습니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
    } catch {
      setToastMessage('');
    }
  };

  const handleShareInvite = async () => {
    const shareUrl = window.location.href;
    const shareImageUrl = new URL(`${BASE_URL}photos/main-share.jpeg`, window.location.href).href;
    try {
      await ensureKakaoReady();
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: '류무민 ♥ 이소연 결혼식에 초대합니다',
          description: '2026년 6월 20일 토요일 오전 11시, 월드컵컨벤션 2F 임페리얼볼룸',
          imageUrl: shareImageUrl,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '모바일 청첩장 보기',
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

  useEffect(() => {
    if (!supabase) {
      setGuestbookLoading(false);
      return;
    }

    let cancelled = false;
    const fetchGuestbook = async () => {
      const { data, error } = await supabase
        .from('guestbook')
        .select('id, name, message, created_at')
        .order('created_at', { ascending: false })
        .limit(30);

      if (!cancelled) {
        if (error) {
          setGuestbookItems([]);
        } else {
          setGuestbookItems(data || []);
        }
        setGuestbookLoading(false);
      }
    };

    fetchGuestbook();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleGuestbookSubmit = async (e) => {
    e.preventDefault();
    const name = guestbookName.trim();
    const password = guestbookPassword.trim();
    const message = guestbookMessage.trim();
    if (!name || !password || !message) {
      setToastMessage('이름, 번호, 메시지를 입력해주세요.');
      window.setTimeout(() => setToastMessage(''), 1800);
      return false;
    }

    if (!supabase) {
      setToastMessage('Supabase 설정이 필요합니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
      return false;
    }

    setGuestbookSubmitting(true);
    const { data, error } = await supabase
      .from('guestbook')
      .insert({ name, password, message })
      .select('id, name, message, created_at')
      .single();

    if (error) {
      setToastMessage('방명록 저장에 실패했습니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
      setGuestbookSubmitting(false);
      return false;
    } else if (data) {
      setGuestbookItems((prev) => [data, ...prev].slice(0, 30));
      setGuestbookName('');
      setGuestbookPassword('');
      setGuestbookMessage('');
      setToastMessage('방명록이 등록되었습니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
      setGuestbookSubmitting(false);
      return true;
    }
    setGuestbookSubmitting(false);
    return false;
  };

  const openDeleteModal = (id) => {
    setDeleteTargetId(id);
    setDeletePassword('');
    setDeleteModalOpen(true);
  };

  const handleDeleteGuestbook = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setToastMessage('Supabase 설정이 필요합니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
      return;
    }
    const password = deletePassword.trim();
    if (!password) {
      return;
    }

    setDeleteSubmitting(true);
    const { data, error } = await supabase.rpc('delete_guestbook_entry', {
      entry_id: deleteTargetId,
      entry_password: password,
    });

    if (error) {
      setToastMessage('삭제에 실패했습니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
      setDeleteSubmitting(false);
      return;
    }

    if (data === true) {
      setGuestbookItems((prev) => prev.filter((item) => item.id !== deleteTargetId));
      setToastMessage('방명록이 삭제되었습니다.');
      window.setTimeout(() => setToastMessage(''), 1800);
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
      setDeletePassword('');
      setDeleteSubmitting(false);
      return;
    }

    setToastMessage('비밀번호가 일치하지 않습니다.');
    window.setTimeout(() => setToastMessage(''), 1800);
    setDeleteSubmitting(false);
  };

  const canSubmitGuestbook =
    guestbookName.trim().length > 0 && guestbookPassword.trim().length > 0 && guestbookMessage.trim().length > 0;

  const openGuestbookModal = () => {
    setGuestbookName('');
    setGuestbookPassword('');
    setGuestbookMessage('');
    setGuestbookModalOpen(true);
  };
  const canSubmitDelete = deletePassword.trim().length > 0;

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
          <div className="hero-stack">
            <div className="hero-paper">
              <div className="hero-paper-head">
                <RevealText
                  as="div"
                  className="hero-paper-kicker"
                  lines={['Wedding Invitation']}
                  active={Boolean(revealedSections[0])}
                />
                <RevealText
                  as="div"
                  className="hero-paper-date"
                  lines={['Saturday, June 20, 2026']}
                  baseDelay={0.06}
                  active={Boolean(revealedSections[0])}
                />
              </div>
              <RevealText
                as="div"
                className="hero-heading"
                lineClassName="hero-arch-title-line"
                lines={['Our', 'Wedding Day']}
                active={Boolean(revealedSections[0])}
              />
              <div className="hero-paper-rule" aria-hidden="true" />
              <div className="hero-frame">
                <img className="hero-image" src={archImage} alt="신랑 신부 메인 사진" />
              </div>
              <div className="hero-meta">
                <RevealText
                  as="div"
                  className="hero-paper-label"
                  lines={['Moomin Ryu and Soyeon Lee']}
                  baseDelay={0.12}
                  active={Boolean(revealedSections[0])}
                />
                <div className="hero-paper-bottom">
                  <RevealText
                    as="div"
                    className="hero-arch-sub hero-arch-names"
                    lineClassName="hero-arch-names-line"
                    lines={['류무민 ♥ 이소연']}
                    baseDelay={0.18}
                    active={Boolean(revealedSections[0])}
                  />
                  <RevealText
                    as="div"
                    className="hero-arch-sub hero-arch-date"
                    lineClassName="hero-arch-date-line"
                    lines={['2026.06.20 SAT AM 11:00']}
                    baseDelay={0.28}
                    active={Boolean(revealedSections[0])}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        <motion.section
          className={`section message ${activeSection === 1 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="1"
          custom={1}
          {...sectionMotion}
        >
          <RevealText as="p" className="map-eyebrow" lines={['Invitation']} active={Boolean(revealedSections[1])} />
          <RevealText as="h2" className="section-title" lines={['초대합니다']} active={Boolean(revealedSections[1])} />
          <RevealText
            as="p"
            className="message-poem"
            lines={[
              <><span className="accent-initial">무</span>르익은 사랑 속에서</>,
              <><span className="accent-initial">민</span>들레 홀씨처럼 인연으로 만난 두 사람</>,
              <><span className="accent-initial">소</span>중한 마음이 하나 되어</>,
              <><span className="accent-initial">연</span>인에서 부부로, 평생을 함께 걸어가려 합니다.</>,
              '귀한 걸음으로 이 자리를 빛내 주신다면',
              '더 없는 기쁨으로 오래도록 간직하겠습니다.',
            ]}
            baseDelay={0.08}
            active={Boolean(revealedSections[1])}
          />
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
          <RevealText as="p" className="map-eyebrow" lines={['Wedding Day']} active={Boolean(revealedSections[2])} />
          <RevealText
            as="h2"
            className="section-title"
            lines={['2026. 06. 20. 토요일 오전 11시']}
            active={Boolean(revealedSections[2])}
          />
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
            <RevealText
              as="p"
              className="count-copy"
              lines={[
                <>
                  류무민 <span>&#9829;</span> 이소연의 결혼식이 <strong>{countdown.days + 1}일</strong> 남았습니다.
                </>,
              ]}
              active={Boolean(revealedSections[2])}
            />
          </div>
        </motion.section>

        <motion.section
          className={`section map ${activeSection === 3 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="3"
          custom={3}
          {...sectionMotion}
        >
          <RevealText as="p" className="map-eyebrow" lines={['Location']} active={Boolean(revealedSections[3])} />
          <RevealText as="h2" className="section-title" lines={['오시는 길']} active={Boolean(revealedSections[3])} />
          <RevealText
            as="p"
            className="map-venue"
            lines={['월드컵컨벤션 2F 임페리얼볼룸']}
            active={Boolean(revealedSections[3])}
          />
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
          <div ref={transportGuideRef} className="transport-guide">
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
              <RevealText
                as="p"
                className="point"
                lines={['월드컵경기장 서측 문화비축기지 정류장 하차 도보 3분']}
                baseDelay={0.05}
                active={transportGuideVisible}
              />
              <RevealText
                as="p"
                lines={['간선: 571, 710, 760']}
                baseDelay={0.1}
                active={transportGuideVisible}
              />
              <RevealText
                as="p"
                lines={['지선: 7019, 7715, 8777']}
                baseDelay={0.15}
                active={transportGuideVisible}
              />
              <RevealText as="p" lines={['광역: 9711']} baseDelay={0.2} active={transportGuideVisible} />
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
              <RevealText
                as="p"
                className="point"
                lines={['6호선 월드컵경기장역 2번 출구 도보 3분 (200m)']}
                baseDelay={0.24}
                active={transportGuideVisible}
              />
              <RevealText
                as="p"
                lines={['월드컵경기장역 2번 출구에서 경기장 서측(W) 방향']}
                baseDelay={0.29}
                active={transportGuideVisible}
              />
              <RevealText
                as="p"
                lines={['환승: 2호선 합정, 3호선 불광·약수, 4호선 삼각지, 5호선 공덕']}
                baseDelay={0.34}
                active={transportGuideVisible}
              />
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
              <RevealText
                as="p"
                className="point"
                lines={['월드컵경기장 서문 진입 후 서측 1,2 주차장 이용']}
                baseDelay={0.38}
                active={transportGuideVisible}
              />
              <RevealText
                as="p"
                lines={['주차 접수대 등록 후 출차 (90분 무료)']}
                baseDelay={0.43}
                active={transportGuideVisible}
              />
              <RevealText
                as="p"
                lines={['외부 주차 2시간 30분 무료 · 발렛파킹 무료']}
                baseDelay={0.48}
                active={transportGuideVisible}
              />
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
          <div className={`grid gallery-grid ${galleryExpanded ? 'is-expanded' : ''}`}>
            {(galleryExpanded ? galleryImages : galleryImages.slice(0, galleryPreviewCount)).map((image, idx) => (
              <button
                key={image.full}
                type="button"
                className="gallery-item"
                onClick={() => {
                  const sourceIndex = galleryImages.findIndex((entry) => entry.full === image.full);
                  setLightboxIndex(sourceIndex);
                  setLightboxOpen(true);
                }}
              >
                <img src={image.thumb} alt={`웨딩 사진 ${idx + 1}`} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
          {galleryImages.length > galleryPreviewCount && (
            <button
              type="button"
              className="gallery-more-btn"
              onClick={() => setGalleryExpanded((prev) => !prev)}
            >
              {galleryExpanded ? '접기' : '더보기'}
            </button>
          )}
        </motion.section>

        <motion.section
          className={`section heart-note ${activeSection === 5 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="5"
          custom={6}
          {...sectionMotion}
        >
          <p className="map-eyebrow">With Heart</p>
          <h2>마음 전하실 곳</h2>
          <RevealText
            as="p"
            lines={['참석이 어려우신 분들을 위해 기재했습니다.', '너그러운 마음으로 양해 부탁드립니다.']}
            baseDelay={0.08}
            active={Boolean(revealedSections[5])}
          />
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
          className={`section guestbook ${activeSection === 6 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="6"
          custom={7}
          {...sectionMotion}
        >
          <p className="map-eyebrow">Guestbook</p>
          <h2>방명록</h2>
          <RevealText
            as="p"
            className="guestbook-note"
            lines={['저희 둘에게 따뜻한 방명록을 남겨주세요']}
            baseDelay={0.08}
            active={Boolean(revealedSections[6])}
          />
          <div className="guestbook-list">
            {guestbookLoading ? (
              <p className="guestbook-empty">불러오는 중...</p>
            ) : guestbookItems.length ? (
              guestbookItems.slice(0, 3).map((item) => (
                <article key={item.id} className="guestbook-item">
                  <div className="guestbook-item-top">
                    <button
                      type="button"
                      className="guestbook-delete-btn"
                      onClick={() => openDeleteModal(item.id)}
                      aria-label="방명록 삭제"
                    >
                      ×
                    </button>
                  </div>
                  <p>{item.message}</p>
                  <div className="guestbook-item-meta">
                    <strong>From {item.name}</strong>
                    <span className="guestbook-date">{formatGuestbookDate(item.created_at)}</span>
                  </div>
                </article>
              ))
            ) : (
              <p className="guestbook-empty">첫 축하 메시지를 남겨 주세요.</p>
            )}
          </div>
          {!guestbookLoading && guestbookItems.length > 3 && (
            <button type="button" className="guestbook-more-btn" onClick={() => setGuestbookViewerOpen(true)}>
              더보기
            </button>
          )}
          <button type="button" className="guestbook-write-btn" onClick={openGuestbookModal}>
            작성하기
          </button>
        </motion.footer>

        <motion.footer
          className={`section footer ${activeSection === 7 ? 'is-current' : 'is-dimmed'}`}
          data-section-index="7"
          custom={8}
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

      {guestbookModalOpen && (
        <div className="guestbook-modal-overlay" role="dialog" aria-modal="true" aria-label="방명록 작성">
          <div className="guestbook-modal">
            <div className="guestbook-modal-head">
              <h3>축하 메시지 작성하기</h3>
              <button type="button" onClick={() => setGuestbookModalOpen(false)} aria-label="닫기">
                ×
              </button>
            </div>
            <p className="guestbook-modal-subtitle">저희 둘의 결혼을 함께 축하해 주세요</p>
            <form
              className="guestbook-modal-form"
              onSubmit={async (e) => {
                const ok = await handleGuestbookSubmit(e);
                if (ok) {
                  setGuestbookModalOpen(false);
                }
              }}
            >
              <label>
                <span className="guestbook-sr-only">
                  작성자 성함 <span>*</span>
                </span>
                <input
                  type="text"
                  value={guestbookName}
                  onChange={(e) => setGuestbookName(e.target.value)}
                  placeholder="성함을 남겨주세요"
                  maxLength={20}
                />
              </label>
              <label>
                <span className="guestbook-sr-only">
                  비밀번호 <span>*</span>
                </span>
                <input
                  type="password"
                  value={guestbookPassword}
                  onChange={(e) => setGuestbookPassword(e.target.value)}
                  placeholder="비밀번호를 입력해 주세요"
                  maxLength={20}
                />
              </label>
              <label>
                <span className="guestbook-sr-only">
                  방명록 내용 <span>*</span>
                </span>
                <textarea
                  value={guestbookMessage}
                  onChange={(e) => setGuestbookMessage(e.target.value)}
                  placeholder="200자 이내로 작성해 주세요"
                  maxLength={200}
                  rows={5}
                />
              </label>
              <button
                type="submit"
                className={canSubmitGuestbook ? 'is-ready' : ''}
                disabled={guestbookSubmitting || !canSubmitGuestbook}
              >
                {guestbookSubmitting ? '등록 중...' : '작성 완료'}
              </button>
            </form>
          </div>
        </div>
      )}

      {guestbookViewerOpen && (
        <div className="guestbook-viewer-overlay" role="dialog" aria-modal="true" aria-label="전체 방명록">
          <div className="guestbook-viewer">
            <div className="guestbook-viewer-head">
              <h3>방명록</h3>
              <button type="button" onClick={() => setGuestbookViewerOpen(false)} aria-label="방명록 닫기">
                ×
              </button>
            </div>
            <div className="guestbook-viewer-list">
              {guestbookItems.map((item) => (
                <article key={`viewer-${item.id}`} className="guestbook-item">
                  <div className="guestbook-item-top">
                    <button
                      type="button"
                      className="guestbook-delete-btn"
                      onClick={() => {
                        setGuestbookViewerOpen(false);
                        openDeleteModal(item.id);
                      }}
                      aria-label="방명록 삭제"
                    >
                      ×
                    </button>
                  </div>
                  <p>{item.message}</p>
                  <div className="guestbook-item-meta">
                    <strong>From {item.name}</strong>
                    <span className="guestbook-date">{formatGuestbookDate(item.created_at)}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="guestbook-modal-overlay" role="dialog" aria-modal="true" aria-label="방명록 삭제">
          <div className="guestbook-modal delete-modal">
            <div className="guestbook-modal-head">
              <h3>방명록 삭제</h3>
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteTargetId(null);
                  setDeletePassword('');
                }}
                aria-label="닫기"
              >
                ×
              </button>
            </div>
            <p className="guestbook-modal-subtitle">메시지를 남길 때 입력한 비밀번호를 입력해 주세요</p>
            <form className="guestbook-modal-form" onSubmit={handleDeleteGuestbook}>
              <label>
                <span className="guestbook-sr-only">
                  삭제 비밀번호 <span>*</span>
                </span>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="삭제 비밀번호를 입력해 주세요"
                  maxLength={20}
                />
              </label>
              <button
                type="submit"
                className={canSubmitDelete ? 'is-ready' : ''}
                disabled={deleteSubmitting || !canSubmitDelete}
              >
                {deleteSubmitting ? '삭제 중...' : '삭제하기'}
              </button>
            </form>
          </div>
        </div>
      )}

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
