import { motion } from 'framer-motion';
import { useInviteShare } from './hooks';

export default function ShareSection({ activeSection, sectionMotion, kakaoAppKey, setToastMessage }) {
  const { handleShareInvite, handleCopyInviteLink } = useInviteShare({ kakaoAppKey, setToastMessage });

  return (
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
  );
}
