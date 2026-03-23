import { motion } from 'framer-motion';
import { BASE_URL } from '../config';
import { RevealText } from '../shared/ui';

export default function InformationSection({ activeSection, revealed, sectionMotion }) {
  return (
    <motion.section
      className={`section section-screen information ${activeSection === 4 ? 'is-current' : 'is-dimmed'}`}
      data-section-index="4"
      custom={4}
      {...sectionMotion}
    >
      <RevealText as="p" className="map-eyebrow" lines={['INFORMATION']} active={revealed} />
      <RevealText as="h2" className="section-title" lines={['연회 & 식사 안내']} active={revealed} />
      <div className="information-card">
        <img
          className="information-image"
          src={`${BASE_URL}photos/image.png`}
          alt="월드컵컨벤션 연회장"
          loading="lazy"
          decoding="async"
        />
        <RevealText
          as="p"
          className="information-copy"
          lines={[
            '식사는 예식 및 촬영이 끝난 후',
            '웨딩홀과 같은 층 연회장에서 진행됩니다.',
            '한식, 중식, 양식, 일식 등',
            '다양한 메뉴가 준비되어 있습니다.',
          ]}
          baseDelay={0.1}
          active={revealed}
        />
      </div>
    </motion.section>
  );
}
