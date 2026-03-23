import { motion } from 'framer-motion';
import { RevealText } from '../shared/ui';
import { GuestbookCreateModal, GuestbookDeleteModal, GuestbookViewerModal } from './GuestbookModals';
import { useGuestbook } from './hooks';

export default function GuestbookSection({
  activeSection,
  revealed,
  sectionMotion,
  supabase,
  setToastMessage,
}) {
  const {
    guestbookName,
    setGuestbookName,
    guestbookPassword,
    setGuestbookPassword,
    guestbookMessage,
    setGuestbookMessage,
    guestbookItems,
    guestbookLoading,
    guestbookSubmitting,
    guestbookModalOpen,
    setGuestbookModalOpen,
    guestbookViewerOpen,
    setGuestbookViewerOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    setDeleteTargetId,
    deletePassword,
    setDeletePassword,
    deleteSubmitting,
    handleGuestbookSubmit,
    openDeleteModal,
    handleDeleteGuestbook,
    openGuestbookModal,
    canSubmitGuestbook,
    canSubmitDelete,
    formatGuestbookDate,
  } = useGuestbook({ supabase, setToastMessage });
  return (
    <>
      <motion.section
        className={`section section-flow guestbook ${activeSection === 6 ? 'is-current' : 'is-dimmed'}`}
        data-section-index="6"
        custom={7}
        {...sectionMotion}
      >
        <RevealText as="p" className="map-eyebrow" lines={['Guestbook']} active={revealed} />
        <RevealText as="h2" className="section-title" lines={['방명록']} active={revealed} />
        <RevealText
          as="p"
          className="guestbook-note"
          lines={['저희 둘에게 따뜻한 방명록을 남겨주세요']}
          baseDelay={0.08}
          active={revealed}
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
      </motion.section>

      <GuestbookCreateModal
        open={guestbookModalOpen}
        onClose={() => setGuestbookModalOpen(false)}
        onSubmit={async (e) => {
          const ok = await handleGuestbookSubmit(e);
          if (ok) {
            setGuestbookModalOpen(false);
          }
        }}
        guestbookName={guestbookName}
        setGuestbookName={setGuestbookName}
        guestbookPassword={guestbookPassword}
        setGuestbookPassword={setGuestbookPassword}
        guestbookMessage={guestbookMessage}
        setGuestbookMessage={setGuestbookMessage}
        guestbookSubmitting={guestbookSubmitting}
        canSubmitGuestbook={canSubmitGuestbook}
      />

      <GuestbookViewerModal
        open={guestbookViewerOpen}
        onClose={() => setGuestbookViewerOpen(false)}
        guestbookItems={guestbookItems}
        openDeleteModal={openDeleteModal}
        formatGuestbookDate={formatGuestbookDate}
      />

      <GuestbookDeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTargetId(null);
          setDeletePassword('');
        }}
        onSubmit={handleDeleteGuestbook}
        deletePassword={deletePassword}
        setDeletePassword={setDeletePassword}
        deleteSubmitting={deleteSubmitting}
        canSubmitDelete={canSubmitDelete}
      />
    </>
  );
}
