import { useEffect, useState } from 'react';

const GUESTBOOK_SUBMIT_INTERVAL_MS = 30 * 1000;
const GUESTBOOK_LAST_SUBMIT_KEY = 'guestbook-last-submit-at';
const GUESTBOOK_NAME_MAX = 12;
const GUESTBOOK_PASSWORD_MIN = 4;
const GUESTBOOK_PASSWORD_MAX = 12;
const GUESTBOOK_MESSAGE_MAX = 200;

function formatGuestbookDate(value) {
  const date = new Date(value);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
}

export default function useGuestbook({ supabase, setToastMessage }) {
  const [guestbookName, setGuestbookName] = useState('');
  const [guestbookPassword, setGuestbookPassword] = useState('');
  const [guestbookMessage, setGuestbookMessage] = useState('');
  const [guestbookWebsite, setGuestbookWebsite] = useState('');
  const [guestbookItems, setGuestbookItems] = useState([]);
  const [guestbookLoading, setGuestbookLoading] = useState(true);
  const [guestbookSubmitting, setGuestbookSubmitting] = useState(false);
  const [guestbookModalOpen, setGuestbookModalOpen] = useState(false);
  const [guestbookViewerOpen, setGuestbookViewerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

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
        setGuestbookItems(error ? [] : data || []);
        setGuestbookLoading(false);
      }
    };

    fetchGuestbook();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const handleGuestbookSubmit = async (e) => {
    e.preventDefault();
    const name = guestbookName.trim();
    const password = guestbookPassword.trim();
    const message = guestbookMessage.trim();
    const website = guestbookWebsite.trim();

    if (!name || !password || !message) {
      setToastMessage('이름, 번호, 메시지를 입력해주세요.');
      window.setTimeout(() => setToastMessage(''), 1800);
      return false;
    }

    if (website) {
      setGuestbookSubmitting(false);
      return false;
    }

    if (name.length > GUESTBOOK_NAME_MAX) {
      setToastMessage(`이름은 ${GUESTBOOK_NAME_MAX}자 이하로 입력해 주세요.`);
      window.setTimeout(() => setToastMessage(''), 1800);
      return false;
    }

    if (password.length < GUESTBOOK_PASSWORD_MIN || password.length > GUESTBOOK_PASSWORD_MAX) {
      setToastMessage(`비밀번호는 ${GUESTBOOK_PASSWORD_MIN}~${GUESTBOOK_PASSWORD_MAX}자로 입력해 주세요.`);
      window.setTimeout(() => setToastMessage(''), 1800);
      return false;
    }

    if (message.length > GUESTBOOK_MESSAGE_MAX) {
      setToastMessage(`메시지는 ${GUESTBOOK_MESSAGE_MAX}자 이내로 작성해 주세요.`);
      window.setTimeout(() => setToastMessage(''), 1800);
      return false;
    }

    if (typeof window !== 'undefined') {
      const lastSubmittedAt = Number(window.localStorage.getItem(GUESTBOOK_LAST_SUBMIT_KEY) || 0);
      if (lastSubmittedAt && Date.now() - lastSubmittedAt < GUESTBOOK_SUBMIT_INTERVAL_MS) {
        setToastMessage('잠시 후 다시 작성해 주세요.');
        window.setTimeout(() => setToastMessage(''), 1800);
        return false;
      }
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
    }

    if (data) {
      setGuestbookItems((prev) => [data, ...prev].slice(0, 30));
      setGuestbookName('');
      setGuestbookPassword('');
      setGuestbookMessage('');
      setGuestbookWebsite('');
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(GUESTBOOK_LAST_SUBMIT_KEY, String(Date.now()));
      }
      setToastMessage('방명록이 등록되었어요. 감사합니다.');
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

  const openGuestbookModal = () => {
    setGuestbookName('');
    setGuestbookPassword('');
    setGuestbookMessage('');
    setGuestbookWebsite('');
    setGuestbookModalOpen(true);
  };

  const canSubmitGuestbook =
    guestbookName.trim().length > 0 &&
    guestbookPassword.trim().length > 0 &&
    guestbookMessage.trim().length > 0 &&
    guestbookWebsite.trim().length === 0;
  const canSubmitDelete = deletePassword.trim().length > 0;

  return {
    guestbookName,
    setGuestbookName,
    guestbookPassword,
    setGuestbookPassword,
    guestbookMessage,
    setGuestbookMessage,
    guestbookWebsite,
    setGuestbookWebsite,
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
  };
}
