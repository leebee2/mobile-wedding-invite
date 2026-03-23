import { motion } from 'framer-motion';
import { useState } from 'react';
import { RevealText } from '../shared/ui';

export default function HeartNoteSection({
  activeSection,
  revealed,
  sectionMotion,
  transferGroups,
  setToastMessage,
}) {
  const [openTransferMap, setOpenTransferMap] = useState({});

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

  return (
    <motion.section
      className={`section section-screen heart-note ${activeSection === 6 ? 'is-current' : 'is-dimmed'}`}
      data-section-index="6"
      custom={6}
      {...sectionMotion}
    >
      <RevealText as="p" className="map-eyebrow" lines={['With Heart']} active={revealed} />
      <RevealText as="h2" className="section-title" lines={['마음 전하실 곳']} active={revealed} />
      <RevealText
        as="p"
        lines={['참석이 어려우신 분들을 위해 기재했습니다.', '너그러운 마음으로 양해 부탁드립니다.']}
        baseDelay={0.08}
        active={revealed}
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
  );
}
