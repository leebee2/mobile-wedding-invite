export function GuestbookCreateModal({
  open,
  onClose,
  onSubmit,
  guestbookName,
  setGuestbookName,
  guestbookPassword,
  setGuestbookPassword,
  guestbookMessage,
  setGuestbookMessage,
  guestbookSubmitting,
  canSubmitGuestbook,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="guestbook-modal-overlay" role="dialog" aria-modal="true" aria-label="방명록 작성">
      <div className="guestbook-modal">
        <div className="guestbook-modal-head">
          <h3>축하 메시지 작성하기</h3>
          <button type="button" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>
        <p className="guestbook-modal-subtitle">저희 둘의 결혼을 함께 축하해 주세요</p>
        <form className="guestbook-modal-form" onSubmit={onSubmit}>
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
          <button type="submit" className={canSubmitGuestbook ? 'is-ready' : ''} disabled={guestbookSubmitting || !canSubmitGuestbook}>
            {guestbookSubmitting ? '등록 중...' : '작성 완료'}
          </button>
        </form>
      </div>
    </div>
  );
}

export function GuestbookViewerModal({
  open,
  onClose,
  guestbookItems,
  openDeleteModal,
  formatGuestbookDate,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="guestbook-viewer-overlay" role="dialog" aria-modal="true" aria-label="전체 방명록">
      <div className="guestbook-viewer">
        <div className="guestbook-viewer-head">
          <h3>방명록</h3>
          <button type="button" onClick={onClose} aria-label="방명록 닫기">
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
                    onClose();
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
  );
}

export function GuestbookDeleteModal({
  open,
  onClose,
  onSubmit,
  deletePassword,
  setDeletePassword,
  deleteSubmitting,
  canSubmitDelete,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="guestbook-modal-overlay" role="dialog" aria-modal="true" aria-label="방명록 삭제">
      <div className="guestbook-modal delete-modal">
        <div className="guestbook-modal-head">
          <h3>방명록 삭제</h3>
          <button type="button" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>
        <p className="guestbook-modal-subtitle">메시지를 남길 때 입력한 비밀번호를 입력해 주세요</p>
        <form className="guestbook-modal-form" onSubmit={onSubmit}>
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
          <button type="submit" className={canSubmitDelete ? 'is-ready' : ''} disabled={deleteSubmitting || !canSubmitDelete}>
            {deleteSubmitting ? '삭제 중...' : '삭제하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
