import { useEffect, useRef } from 'react';
import { BASE_URL } from '../../config';

export default function useInviteShare({ kakaoAppKey, setToastMessage }) {
  const kakaoReadyRef = useRef(false);

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

  useEffect(() => {
    if (!kakaoAppKey || kakaoReadyRef.current) {
      return;
    }
    ensureKakaoReady().catch(() => {});
  }, [kakaoAppKey]);

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

  return { handleShareInvite, handleCopyInviteLink };
}
