import { motion } from 'framer-motion';
import { RevealText } from '../shared/ui';

export default function InvitationSection({ activeSection, revealed, sectionMotion }) {
  return (
    <motion.section
      className={`section section-screen message ${activeSection === 1 ? 'is-current' : 'is-dimmed'}`}
      data-section-index="1"
      custom={1}
      {...sectionMotion}
    >
      <RevealText as="p" className="map-eyebrow" lines={['Invitation']} active={revealed} />
      <RevealText as="h2" className="section-title" lines={['초대합니다']} active={revealed} />
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
        active={revealed}
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
            <div className="family-inline-row">
              <RevealText
                as="p"
                className="family-inline-copy"
                lines={[
                  <>
                    <span className="family-inline-parents">
                      류세형 · 이명자 <span className="family-line-suffix">장남</span>
                    </span>{' '}
                    <strong>류무민</strong>
                  </>,
                ]}
                baseDelay={0.18}
                active={revealed}
              />
              <a className="phone-icon-link" href="tel:01080201271" aria-label="신랑에게 전화하기">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.65 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.22a2 2 0 0 1 2.11-.45c.84.31 1.72.53 2.62.65A2 2 0 0 1 22 16.92z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="row family-row">
            <div className="family-inline-row">
              <RevealText
                as="p"
                className="family-inline-copy"
                lines={[
                  <>
                    <span className="family-inline-parents">
                      이지홍 · 심미란 <span className="family-line-suffix">장녀</span>
                    </span>{' '}
                    <strong>이소연</strong>
                  </>,
                ]}
                baseDelay={0.3}
                active={revealed}
              />
              <a className="phone-icon-link" href="tel:01021704869" aria-label="신부에게 전화하기">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.65 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.22a2 2 0 0 1 2.11-.45c.84.31 1.72.53 2.62.65A2 2 0 0 1 22 16.92z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
