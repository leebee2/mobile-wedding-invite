import { motion } from 'framer-motion';
import { RevealText } from '../shared/ui';

export default function HeroSection({
  activeSection,
  revealed,
  sectionMotion,
  bgmPlaying,
  toggleBgm,
  archImage,
}) {
  return (
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
            <RevealText as="div" className="hero-paper-kicker" lines={['Wedding Invitation']} active={revealed} />
            <RevealText
              as="div"
              className="hero-paper-date"
              lines={['Saturday, June 20, 2026']}
              baseDelay={0.06}
              active={revealed}
            />
          </div>
          <div className="hero-paper-rule" aria-hidden="true" />
          <div className="hero-frame">
            <RevealText
              as="div"
              className="hero-heading"
              lineClassName="hero-arch-title-line"
              lines={['Our', 'Wedding Day']}
              active={revealed}
            />
            <img className="hero-image" src={archImage} alt="신랑 신부 메인 사진" />
          </div>
          <div className="hero-meta">
            <RevealText
              as="div"
              className="hero-paper-label"
              lines={['Moomin Ryu and Soyeon Lee']}
              baseDelay={0.12}
              active={revealed}
            />
            <div className="hero-paper-bottom">
              <RevealText
                as="div"
                className="hero-arch-sub hero-arch-names"
                lineClassName="hero-arch-names-line"
                lines={['류무민 ♥ 이소연']}
                baseDelay={0.18}
                active={revealed}
              />
              <RevealText
                as="div"
                className="hero-arch-sub hero-arch-date"
                lineClassName="hero-arch-date-line"
                lines={['2026.06.20 SAT AM 11:00']}
                baseDelay={0.28}
                active={revealed}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
