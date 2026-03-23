import { createClient } from '@supabase/supabase-js';

export const BASE_URL = import.meta.env.BASE_URL;

export const introImages = [`${BASE_URL}photos/intro-opt/001.jpg`, `${BASE_URL}photos/intro-opt/003.jpg`];
export const archImage = `${BASE_URL}photos/main.jpeg`;
export const bgmSrc = `${BASE_URL}photos/krasnoshchok-wedding-romantic-love-music-409293.mp3`;

export const galleryFiles = [
  { full: 'YG_00081.jpg', thumb: 'YG_00081.jpg' },
  { full: 'YG_00164.jpg', thumb: 'YG_00164.jpg' },
  { full: 'YG_00277.jpg', thumb: 'YG_00277.jpg' },
  { full: '002.jpeg', thumb: '002.jpg' },
  { full: 'YG_00337.jpg', thumb: 'YG_00337.jpg' },
  { full: 'YG_00506.jpg', thumb: 'YG_00506.jpg' },
  { full: 'YG_00566.jpg', thumb: 'YG_00566.jpg' },
  { full: 'YG_00671.jpg', thumb: 'YG_00671.jpg' },
  { full: 'YG_00702.jpg', thumb: 'YG_00702.jpg' },
  { full: 'YG_00849.jpg', thumb: 'YG_00849.jpg' },
  { full: 'YG_00907.jpg', thumb: 'YG_00907.jpg' },
  { full: 'YG_00970.jpg', thumb: 'YG_00970.jpg' },
  { full: 'YG_01006.jpg', thumb: 'YG_01006.jpg' },
  { full: 'YG_01033.jpg', thumb: 'YG_01033.jpg' },
  { full: 'YG_01176.jpg', thumb: 'YG_01176.jpg' },
  { full: '004.jpeg', thumb: '004.jpg' },
  { full: 'YG_01600.jpg', thumb: 'YG_01600.jpg' },
  { full: 'YG_01812.jpg', thumb: 'YG_01812.jpg' },
  { full: '003.jpeg', thumb: '003.jpg' },
  { full: 'YG_02075.jpg', thumb: 'YG_02075.jpg' },
  { full: 'YG_02181.jpg', thumb: 'YG_02181.jpg' },
  { full: 'YG_02268.jpg', thumb: 'YG_02268.jpg' },
  { full: 'YG_02335.jpg', thumb: 'YG_02335.jpg' },
  { full: 'YG_02348.jpg', thumb: 'YG_02348.jpg' },
  { full: 'YG_02359.jpg', thumb: 'YG_02359.jpg' },
  { full: 'YG_02468.jpg', thumb: 'YG_02468.jpg' },
  { full: 'YG_02490.jpg', thumb: 'YG_02490.jpg' },
  { full: 'YG_02670.jpg', thumb: 'YG_02670.jpg' },
  { full: 'YG_02690.jpg', thumb: 'YG_02690.jpg' },
  { full: 'YG_02792.jpg', thumb: 'YG_02792.jpg' },
  { full: 'YG_02919.jpg', thumb: 'YG_02919.jpg' },
  { full: 'YG_02944.jpg', thumb: 'YG_02944.jpg' },
  { full: 'YG_02976.jpg', thumb: 'YG_02976.jpg' },
];

export const galleryImages = galleryFiles.map((file) => ({
  thumb: `${BASE_URL}photos/thumbs/${file.thumb}`,
  full: `${BASE_URL}photos/display/${file.full}`,
}));

export const galleryPreviewCount = 6;
export const weddingDate = new Date(2026, 5, 20);
export const weddingDateTime = new Date('2026-06-20T11:00:00+09:00');
export const venuePosition = { lat: 37.56842, lng: 126.89615 };

export const transferGroups = [
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

export const kakaoAppKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
